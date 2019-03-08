import React from 'react';
import { connect } from 'react-redux';
import { Menu, Icon } from 'semantic-ui-react';

import { setCurrentChannel, setPrivateChannel } from '../../actions';

import firebase from '../../config/firebase';

class DirectMessages extends React.Component {
	state = {
		activeChannel: '',
		user: this.props.currentUser,
		users: [],
		usersRef: firebase.database().ref('users'),
		connectedRef: firebase.database().ref('.info/connected'),
		presenceRef: firebase.database().ref('presence')
	}

	componentDidMount() {
		if (this.state.user) {
			this.addListeners(this.state.user.uid);
		}
	}

	/**
	 * Add Firebase listeners
	 */
	addListeners = (uid) => {
		let loadedUsers = [];
		const { usersRef, connectedRef, presenceRef } = this.state;
		
		// Grab all users except current user
		usersRef.on('child_added', (snap) => {
			if (uid !== snap.key) {
				let user = snap.val();
				user['uid'] = snap.key;
				user['status'] = 'offline';
				loadedUsers.push(user);
				this.setState({ users: loadedUsers });
			}
		});

		// A user has connected, add their presence
		connectedRef.on('value', (snap) => {
			if (snap.val() === true) {
				const ref = presenceRef.child(uid);
				ref.set(true);
				ref.onDisconnect().remove((err) => {
					if (err !== null) {
						console.error(err);
					}
				});
			}
		});

		// A user came online
		presenceRef.on('child_added', (snap) => {
			if (uid !== snap.key) {
				this.addStatusToUser(snap.key);
			}
		});

		// A user went offline
		presenceRef.on('child_removed', (snap) => {
			if (uid !== snap.key) {
				this.addStatusToUser(snap.key, false);
			}
		});
	}

	/**
	 * Add online/offline status to users
	 */
	addStatusToUser = (uid, connected = true) => {
		const updatedUsers = this.state.users.reduce((acc, user) => {
			if (user.uid === uid) {
				user['status'] = connected ? 'online' : 'offline';
			}
			return acc.concat(user);
		}, []);
		this.setState({ users: updatedUsers });
	}

	/**
	 * Check if user is online or offline helper
	 */
	isUserOnline = ({ status }) => status === 'online';

	/**
	 * Switch to direct message feed
	 */
	changeChannel = (user) => {
		const channelId = this.getChannelId(user.uid);
		const channelData = {
			id: channelId,
			name: user.displayName
		}
		this.props.setCurrentChannel(channelData);
		this.props.setPrivateChannel(true);
		this.setActiveChannel(user.uid);
	}

	/**
	 * Get/create unique channel ID for direct message
	 */
	getChannelId = (uid) => {
		const currentuid = this.state.user.uid;
		return uid < currentuid ? `${uid}/${currentuid}` : `${currentuid}/${uid}`
	}

	/**
	 * Sets the currently active channel
	 */
	setActiveChannel = (uid) => {
		this.setState({ activeChannel: uid });
	}
	
	/**
	 * Display list of users
	 */
	displayUsersList = (users) => (
		users.length > 0 && users.map((user) => (
			<Menu.Item
				key={user.uid}
				onClick={() => this.changeChannel(user)}
				active={user.uid === this.state.activeChannel}
				className="menu-item"
			>
				<span>
					<Icon 
						name="circle" 
						color={this.isUserOnline(user) ? 'green' : 'grey'}
						size="small"
					/> {user.displayName}
				</span>
			</Menu.Item>
		))
	);

	render() {
		const { users } = this.state;

		return (
			<Menu.Menu className="menu">
				<Menu.Item>
					<span className="menu-header">
						Direct Messages ({users.length})
					</span>
				</Menu.Item>
				{this.displayUsersList(users)}
			</Menu.Menu>
		)
	}
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(DirectMessages);