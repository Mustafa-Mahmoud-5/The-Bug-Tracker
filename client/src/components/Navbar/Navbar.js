import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import Avatar from '@material-ui/core/Avatar';
import GroupIcon from '@material-ui/icons/Group';
import Badge from '@material-ui/core/Badge';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Modal from '../Modal/Modal';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import {NavLink}from 'react-router-dom'
const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
		display: 'flex',
		height: '100%',
		position: 'relative',
    width: '100%',

  },
	appBar: {
		backgroundColor: '#11161a',
		color: '#03a9f4',
		transition: theme.transitions.create([ 'margin', 'width' ], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
		transition: theme.transitions.create([ 'margin', 'width' ], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	hide: {
		display: 'none'
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		backgroundColor: '#11161a',
		color: '#03a9f4',

		width: drawerWidth
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end'
	},
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
		marginLeft: -drawerWidth,
		height: '100%',
  },
	contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },  navLink: {
    color: 'inherit',
    textDecoration: 'none',
    display: 'inline-block',
		width: '100%',
		// height: '100%'

  },
  navActive: {
    backgroundColor: '#030405',
    // color: '#101519'
  }
}));

export default function PersistentDrawerLeft(props) {
	const classes = useStyles();
	const theme = useTheme();
	const [ open, setOpen ] = React.useState(!(window.innerWidth < 700));
  const [notificationOpen, setNotificationOpen] = React.useState(false);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
  };
  
  const handleNotificationOpen = () => {
    setNotificationOpen(true)
  }

  const handleNotificationClose = () =>{
    setNotificationOpen(false)
  }


	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar
				position='fixed'
				className={clsx(classes.appBar, {
					[classes.appBarShift]: open
				})}
			>
				{/* upper toolbar */}
				<Toolbar>
					<IconButton
						color='inherit'
						aria-label='open drawer'
						onClick={handleDrawerOpen}
						edge='start'
						className={clsx(classes.menuButton, open && classes.hide)}
					>
						<MenuIcon />
					</IconButton>
					{/* NEW PROJECT */}
          <Tooltip title = 'New Project'>
					<Button color='primary' size='small' variant='contained' >
						+
					</Button>

          </Tooltip>
					{/* NOTIFIATIONS */}
					<div style={{ marginLeft: 'auto' }}>
						<IconButton color='primary' onClick = {handleNotificationOpen}>
							<Badge color='secondary' badgeContent={props.userNotifications?.notifications.length} >
								<NotificationsActiveIcon color='primary' />
							</Badge>
              
						</IconButton>
						<IconButton color='primary'>
							<ExitToAppIcon color='primary' />
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>

			{/* LEFT DRAWER */}
			<Drawer
				className={classes.drawer}
				variant='persistent'
				anchor='left'
				open={open}
				classes={{
					paper: classes.drawerPaper
				}}
			>
				<div className={classes.drawerHeader}>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
					</IconButton>
				</div>
				<Divider />
				<List>
					{[ 'Profile', 'Dashboard', 'Teams' ].map((text, index) => (
            <NavLink key = {index} to = {`/bugtracker/${text.toLowerCase()}`} activeClassName = {classes.navActive} className = {classes.navLink}>

						<ListItem button key={text}>
							<ListItemIcon>
								{text === 'Profile' ? (
									<Avatar color='primary' alt='image' src = {props.userImg?.url} />
								) : text === 'Dashboard' ? (
									<DashboardIcon color='primary' />
								) : text === 'Teams' ? (
									<GroupIcon color='primary' />
								) : null}
							</ListItemIcon>
							<ListItemText primary={text} />
						</ListItem>
            </NavLink>

					))}
				</List>
			</Drawer>
			{/* APPLICATION */}
			<main
				className={clsx(classes.content, {
					[classes.contentShift]: open
				})}
			>
				<div className={classes.drawerHeader} />



        
        
        <Modal modalOpen = {notificationOpen} closeModal = {handleNotificationClose} header = 'Notifications'>

            
          {props.userNotifications?.notifications.length === 0 ? <h2 style={{textAlign:'center'}}>You have no notifications.</h2> : <List>
          {props.userNotifications?.notifications.map((notification, i) => {
                return (

                  <ListItem key = {i}>
                  <ListItemAvatar>
                    <Avatar/>
                  </ListItemAvatar>
                  <ListItemText
                    primary={notification}
                    />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              )
              })
              }

            </List>
            }
        </Modal>



        {/* Outer APP */}


			<div style={{height: '100%'}}>

				{props.children}

			</div>

			</main>
		</div>
	);
}
