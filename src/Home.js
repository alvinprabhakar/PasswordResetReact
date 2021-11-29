import { Toolbar , AppBar , Box , Typography ,  IconButton ,  Button  , TextField , Link ,
          Dialog , DialogTitle , DialogContent , DialogContentText,
          DialogActions } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import {makeStyles} from '@material-ui/core/styles';
import React, {  useState } from 'react';
import axios from 'axios';
import * as emailjs from 'emailjs-com'


const styles = makeStyles(theme => ({

  loginClass: {
      margin: '5%',
      justifyContent: 'space-between'
  },
  bodyColor:{
    backgroundColor: 'whitesmoke'
  },
  loginButton:{
    marginTop: '5%',
    backgroundColor: '#0063cc',
    color: 'white'
  },
  loginRight: {
      marginLeft: 'auto',
    },
  imageSize: {
    margin: 'auto',
    height: 'auto',
    width: '100%',
  },
  formBox:{
    margin: '5%',
    width: '90%'
  },
  formBoxPassword:{
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '5%',
    width: '90%'
  },
  errorText:{
    marginLeft: '5%',
    color: 'red',
  },
  signUpSuccess: {
    
    color: 'green',
    textAlign: 'center'
  },
  signUpFailure: {
    color: 'red',
    textAlign: 'center'
  },
  signUpReset: {
    color: 'teal',
    textAlign: 'center'
  }
}))


function Home() {

  const API_URL = "https://alvin-passwordreset-api.herokuapp.com/users/"

  const initialState = {
    firstName: "",
    lastName: "",
    eMail: "",
    password: "",
    confirmPassword: ""
  };

  let templateParams = {
    firstName: '',
    to_name: '',
    password: ''
}
  
  const classes = styles();

  const [userData , getUserData] = useState({eMail:"",password:""});

  const [addUser, getAddUser] = useState(initialState);

  const [ error , setError] = useState();

  const [signSuccess , setSignSucess] = useState();

  const [signFailure , setSignFailure] = useState();

  const [signReset , setSignReset] = useState();

  const [dialogOpen , setDialogOpen] = useState(false);

  const [resetEmail , getResetEmail] = useState({eMail:""});

  // useEffect( () => {
  //   console.log("use Effect Called");
  // },[addUser])

  const createUser = async () => {

    console.log("Create User Method Called");
    const data = await axios.post(API_URL,{
              firstName: addUser.firstName , 
              lastName: addUser.lastName , 
              eMail: addUser.eMail , 
              password: addUser.password
     });
    console.log(data);
    if(data.status === 200){
        setSignSucess("User Account Created Successfully");
    }
  }

  const LoginUser = async () => {
    console.log("Login User Method Called");
    const {data} = await axios.get(`${API_URL}/getuser/${userData.eMail}`);
    console.log(data[0].eMail);
    if(userData.password === data[0].password){
      setSignSucess("User Login Sucessfully");
    }else{
      setSignFailure("username/password is incorrect");
    }
    
    clearLoginState();
  }

  const updateLoginUser = async () => {
    console.log("User Random DB password Method Called");
    templateParams.password = Math.random().toString(20).substr(2, 8)
    console.log(templateParams);

    const {data} = await axios.put(`${API_URL}/getuser/${resetEmail.eMail}`,{
      password: templateParams.password 
          });
      console.log(data);
      console.log(data.value.firstName);
    templateParams.firstName = data.value.firstName;
    console.log(templateParams.firstName);
    templateParams.to_name = data.value.eMail;
    emailjs.send( 'service_1wd7rui', 'template_zzjaqgw' , templateParams , 'user_mt3BjjClgXGrsF1q7ORaY' );
    setSignReset("Please Check your email to reset the password!!");
    getResetEmail("")
  }

  const clearState = () => {
    console.log("clear state called");
    getAddUser({...initialState})
  }

  const clearLoginState = () => {
    console.log("clear state called");
    getUserData({eMail:"",password:""})
  }

  const forgotPassword = (e) => {
    e.preventDefault(); // Prevents default refresh by the browser
    console.log(e);
    console.log("Forgot Password Clicked");
    console.log(resetEmail);
    updateLoginUser();
    //console.log(templateParams);
    //emailjs.send( 'service_1wd7rui', 'template_zzjaqgw' , templateParams , 'user_mt3BjjClgXGrsF1q7ORaY' );
    // .then((result) => {
    // alert("Message Sent, We will get back to you shortly", result.text);
    // },
    // (error) => {
    // alert("An error occurred, Please try again", error.text);
    // });
    
    }

    const handleClickOpen = () => {
      setDialogOpen(true);
    };
  
    const handleClose = (e) => {
      setDialogOpen(false);
      e.preventDefault(); // Prevents default refresh by the browser
      console.log(e);
      console.log("Forgot Password Clicked");
      forgotPassword(e);
    };

  const handleLoginUser = (e) => {
    setError("")
    setSignSucess("")
    setSignFailure("")
    setSignReset("")
    getUserData({...userData,[e.target.name]:e.target.value})
}

const handleLoginSubmit = (e) => {
  e.preventDefault();
  console.log(e);
  console.log(userData);
  LoginUser();
}

const handleLoginEmail = (e) => {
  getResetEmail({...resetEmail,[e.target.name]:e.target.value})
}

  const handleAddUser = (e) => {
    setError("")
    setSignSucess("")
    getAddUser({...addUser,[e.target.name]:e.target.value})
}

const handleSubmit = (e) => {
  e.preventDefault();
  console.log(e);
  console.log(addUser);
  
  if(addUser.password !== addUser.confirmPassword){
    setError("Passwords won't match");  
    clearState(); 
  }
  else{
    createUser();
    clearState(); 
  }
}
  
  return (
    <>
        <div  className={classes.bodyColor}>
        <Box className={classes.bodyClass}>
     <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="medium"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className={classes.loginRight}>
            Password Reset System 
          </Typography>
            <Link href="#" color="inherit" underline="none" className={classes.loginRight} >Register</Link>
        </Toolbar>
      </AppBar>
    </Box>
    </Box>

    <Typography className={classes.signUpSuccess}>{signSuccess}</Typography>
    <Typography className={classes.signUpFailure}>{signFailure}</Typography>
    <Typography className={classes.signUpReset}>{signReset}</Typography>



    <Box style={{display: 'flex'}} className={classes.loginClass}>
    <Box
  sx={{
    width: 500,
    height: 300,
    margin: '50px',
    maxWidth: '40%',
    borderRadius: '10px',
    backgroundColor: 'white'

  }}>
      <form onSubmit={handleLoginSubmit}>
        <Box m='auto'>
        <TextField id="outlined-basic1" label="Email" variant="outlined"  name="eMail" className={classes.formBox} 
                    onChange={handleLoginUser} value={userData.eMail}/>
        </Box>
        <Box m='auto'>
        <TextField id="outlined-basic2" label="Password" variant="outlined"  name="password" className={classes.formBox} 
                    type="password"  onChange={handleLoginUser} value={userData.password}/>
        </Box>
        <Link href='#' underline="none" className={classes.formBox} onClick={handleClickOpen}>Forgot Password?</Link>
        <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please Enter your registered Email ID to reset the Password.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            name="eMail"
            fullWidth
            variant="standard"
            onChange={handleLoginEmail} value={resetEmail.eMail}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Submit</Button>
        </DialogActions>
      </Dialog>
        <Box textAlign='center'>
            <Button variant='contained'className={classes.loginButton} type="submit">Login</Button>
        </Box>
      </form>
    </Box>

   

    <Box
        sx={{
    width: 500,
    height: 600,
    margin: '50px',
    maxWidth: '40%',
    borderRadius: '10px',
    backgroundColor: 'white'

  }}>
      <form onSubmit={handleSubmit} key={addUser.eMail}>
        <Box m='auto'>
        <TextField id="outlined-basic11" label="First Name" variant="outlined"  name="firstName" className={classes.formBox}
                    onChange={handleAddUser} value={addUser.firstName}/>
        </Box>
        <Box m='auto'>
        <TextField id="outlined-basic21" label="Last Name" variant="outlined"  name="lastName" 
                    className={classes.formBox}  onChange={handleAddUser} value={addUser.lastName}/>
        </Box>
        <Box m='auto'>
        <TextField id="outlined-basic" label="Email" variant="outlined"  name="eMail" 
                    className={classes.formBox} onChange={handleAddUser} value={addUser.eMail}/>
        </Box>
        <Box m='auto'>
        <TextField id="outlined-basic4" label="Password" variant="outlined"  name="password" 
                    className={classes.formBox} type="password" onChange={handleAddUser} value={addUser.password}/>
        </Box>
        <Box m='auto'>
        <TextField id="outlined-basic5" label="Confirm Password" variant="outlined"  name="confirmPassword" 
                    className={classes.formBoxPassword} type="password" onChange={handleAddUser} value={addUser.confirmPassword}/>
        <Typography className={classes.errorText}>{error}</Typography>
        </Box>
        
        <Box textAlign='center'>
            <Button variant='contained'className={classes.loginButton} type="submit">Sign Up</Button>
        </Box>
      </form>
    </Box>
  
      </Box>
      </div>
    </>
  );
}

export default Home;
