import axios from 'axios'
import { Box, Button, ButtonGroup, Card, CardContent, Container, Fab, Grid, Modal, Rating, TextareaAutosize, Tooltip, Typography } from '@mui/material';
import AppLayout from '@/components/Layouts/AppLayout';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import laravelAxios from '@/lib/laravelAxios';
import AddIcon from '@mui/icons-material/Add'
import StarIcon from '@mui/icons-material/Star'
import { UpdateRounded } from '@mui/icons-material';
import { useAuth } from '@/hooks/auth';

const Detail = ({detail,media_type, media_id}) => {
const[open ,setOpen] = useState(false)
const[rating, setRating] = useState(0);
const[review, setReview] = useState("");
const[reviews, setReviews] = useState([]);
const[averageRating, setRAverageRating] = useState(null);
const { user } = useAuth({middleware: 'auth'});
console.log(user);

const handleOpen = () => {
    setOpen(true)
}
const handleClose = () => {
    setOpen(false)
}
const handleReviewChange = (e) => {
    setReview(e.target.value)
    console.log(review)
}
const handleRatingChange = (e, newValue) => {
    setRating(newValue)
    console.log(rating);
}
const isDisabled = !rating || !review.trim()

const handleReviewAdd = async() =>{
    handleClose()
    try{
        const response = await laravelAxios.post(`api/reviews`,{
            content: review,
            rating: rating,
            media_type: media_type,
            media_id: media_id
        })
        console.log(response.data);
        const newReview = response.data;

        setReviews([...reviews, newReview]);
        console.log(reviews);

        setReview("");
        setRating(0);

        const updateReviews = [...reviews, newReview];
        updateAverageRating(updateReviews)

    } catch(err){
        console.log(err);
        
    }
}

const updateAverageRating = (updateReviews) => {
    if(updateReviews.length > 0) {
        const totalRating = updateReviews.reduce((acc, review) => acc + review.rating, 0);
        console.log(totalRating)
        const average = (totalRating / updateReviews.length).toFixed(1);
        setRAverageRating(average);
    } else {
        setRAverageRating(null);
    }
}

const handleDelete = async(id) => {
    console.log(id);
    if (window.confirm('レビューを削除してもよろしいですか？')){
        try {
            const response = await laravelAxios.delete(`api/review/${id}`);
            console.log(response);
            const filteredReviews = reviews.filter((review) => review.id !== id);
            console.log(filteredReviews);
            setReviews(filteredReviews)
            updateAverageRating(filteredReviews);
        } catch(err) {
            console.log(err);
        }
    }
}

    useEffect(()=> {
        const fetchReviews = async() => {
            try{
                const response = await laravelAxios.get(`api/reviews/${media_type}/${media_id}`)
                console.log(response);
                const fetchReviews = response.data;
                setReviews(fetchReviews)
                updateAverageRating(fetchReviews)
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
                        <Box
                            gap={2}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                mb:2
                            }}>
                            <Rating
                                readOnly
                                precision={0.5}
                                value={parseFloat(averageRating)}
                                emptyIcon={<StarIcon style={{color: "white"}}/>}
                            />
                            <Typography
                                sx={{
                                    ml:1,
                                    fontSize: '1.5rem',
                                    fontWeight: "bold",
                            }}>{averageRating}</Typography>

                        </Box>
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
                                {user?.id === review.user.id && (
                                    <Grid sx={{display: "flex", justifyContent: "flex-end"}}>
                                        <ButtonGroup>
                                            <Button>編集</Button>
                                            <Button color='error' onClick={() => handleDelete(review.id)}>削除</Button>
                                        </ButtonGroup>
                                    </Grid>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    
                ))}
            </Grid>

        </Container>
        
        {/* レビュー追加ボタン */}
        <Box
        sx={{
            position: "fixed",
            bottom: "16px",
            right: "16px",
            zIndex: 5,
        }}
        >
            <Tooltip title="レビュー追加">
                <Fab
                    style={{background: "#1976d2", color: "white"}}
                    onClick={handleOpen}
                >
                    <AddIcon />
                </Fab>
            </Tooltip>
        </Box>
        {/* モーダルウインドウ */}
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    border: "2px solid, #000",
                    boxShadow: 24,
                    p: 4
                }}>
                    <Typography variant="h6" component="h2">
                        レビューを書く
                    </Typography>

                    <Rating
                        required
                        onChange={handleRatingChange}
                        value={rating}
                    />
                    <TextareaAutosize 
                        required
                        minRows={5}
                        placeholder='レビュー内容'
                        style={{width: "100%", marginTop: "10px"}}
                        onChange={handleReviewChange}
                        value={review}
                    />
                    <Button
                        variant='outlined'
                        disabled={isDisabled}
                        onClick={handleReviewAdd}
                    >
                        送信
                    </Button>
                    
            </Box>
        </Modal>
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
