import axios from 'axios'
import { Box, Card, CardContent, Container, Grid, Rating, Typography } from '@mui/material';
import AppLayout from '@/components/Layouts/AppLayout';
import React, { useEffect } from 'react';
import Head from 'next/head';
import laravelAxios from '@/lib/laravelAxios';

const Detail = ({detail,media_type, media_id}) => {
    // console.log(detail);
    
    const reviews = [
        {
            id: 1,
            content: "面白かった",
            rating: 4,
            user: {
                name: "小林和樹",
            }
        }
    ]
    useEffect(()=> {
        const fetchReviews = async() => {
            try{
                const response = await laravelAxios.get(`api/reviews/${media_type}/${media_id}`)
                console.log(response);
            }
            catch(err){
                console.log(err)
            }
        }
        fetchReviews()

    },[media_type,media_id])
  return (
    <AppLayout
        header={
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                Detail
            </h2>
        }>
        <Head>
            <title>Laravel - Detail</title>
        </Head>
        {/* 映画情報部分 */}
        <Box
            sx ={{
                height: { xs : "auto", md: "70vh"} ,bgcolor: "red",position: "relative", display: "flex", alignItems: "center"
            }}
        >
            <Box
                sx={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original/${detail.backdrop_path})`,
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right:0,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",

                    '&::before': {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(10px)",
                    }
                }}
            />

            <Container sx={{zIndex: 1}}>
                <Grid sx={{color: "white"}} container alignItems={"center"}>
                    <Grid item md={4} sx={{display: "flex", justifyContent: "center"}}>
                        <img width={"70%"} src={`https://image.tmdb.org/t/p/original${detail.poster_path}`} alt="" />
                    </Grid>
                    <Grid item md={8}>
                        <Typography variant="h4" paragraph>{detail.title || detail.name}</Typography>
                        <Typography paragraph>{detail.overview}</Typography>
                        <Typography variant='h6'>
                            {media_type == "movie" ? `公開日：${detail.release_date}`:`初回放送日：${detail.first_air_date}`}
                        </Typography>
                    </Grid>
                </Grid>
            </Container>

        </Box>
        {/* レビュー内容表示 */}
        <Container sx={{py:4}}>
            <Typography
                conponent={"h1"}
                variant='h4'
                align='center'
                gutterBottom
            >
                レビュー一覧
            </Typography>
            <Grid container spacing={3}>
                {reviews.map((review) => (
                    <Grid item xs={12} key={review.id}>
                        <Card>
                            <CardContent>
                                <Typography
                                    variant='h6'
                                    component={"div"}
                                    gutterBottom>
                                    {review.user.name}
                                </Typography>
                                <Rating 
                                    value={review.rating}
                                    readOnly
                                />
                                <Typography
                                    variant='body2'
                                    color="textSecondary"
                                    paragraph
                                >
                                    {review.content}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                ))}
            </Grid>

        </Container>
    </AppLayout>
  )
}

export async function getServerSideProps(context){
    const { media_type, media_id } = context.params
    try{
        const jpResponse = await axios.get(`https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=ja-JP`);

        let combinedData = {...jpResponse.data}

        if (!jpResponse.data.overview){
            const enResponse = await axios.get(`https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`);
            combinedData.overview = enResponse.data.overview
        }

        return {
            props:{detail: combinedData, media_type, media_id}
        }
    }catch {
        return { notfound: true}
    }
}
export default Detail
