import React from 'react';
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';

import { setCurrentChannel, setPrivateChannel } from '../../actions';

import firebase from '../../config/firebase';

class Starred extends React.Component {
	state = {
		user: this.props.currentUser,
		usersRef: firebase.database().ref('users'),
		activeChannel: '',
		starredChannels: []
	}

	componentDidMount() {
		this.addListeners(this.state.user.uid);
	}

	addListeners = (userId) => {
		// Watches for channel starring
		this.state.usersRef
			.child(`${userId}/starred`)
			.on('child_added', (snap) => {
				const starredChannel = { id: snap.key, ...snap.val() }
				this.setState({
					starredChannels: [ ...this.state.starredChannels, starredChannel ]
				});
			});

		// Watches for channel unstarring
		this.state.usersRef
			.child(`${userId}/starred`)
			.on('child_removed', (snap) => {
				const starredChannelRemoved = { id: snap.key, ...snap.val() }
				const filteredChannels = this.state.starredChannels.filter((channel) => {
					return channel.id !== starredChannelRemoved.id
				});
				this.setState({
					starredChannels: filteredChannels
				});
			});
	}

	/**
	 * Handle onClick channel changing
	 */
	changeChannel = (channel) => {
		this.setActiveChannel(channel);
		//this.clearNotifications();
		this.props.setCurrentChannel(channel);
		this.props.setPrivateChannel(false);
		this.setState({ channel });
	}

	/**
	 * Set currently active channel indication
	 */
	setActiveChannel = (channel) => {
		this.setState({ activeChannel: channel.id });
	}

	/**
	 * Display channel items
	 */
	displayChannelsList = (starredChannels) => (
		starredChannels.length > 0 && starredChannels.map((channel) => (
			<Menu.Item 
				key={channel.id} 
				onClick={() => this.changeChannel(channel)} 
				name={channel.name} 
				active={channel.id === this.state.activeChannel}
				className="menu-item"
			>
				# {channel.name}
			</Menu.Item>
		))
	)

	render() {
		const { starredChannels } = this.state;

		return (
			<Menu.Menu className="menu">
				<Menu.Item>
					<span className="menu-header">
						starred ({ starredChannels.length })
					</span>
				</Menu.Item>
				{this.displayChannelsList(starredChannels)}
			</Menu.Menu>
		);
	}
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred);