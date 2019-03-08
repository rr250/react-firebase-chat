import React from 'react';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';

import firebase from '../../config/firebase';

class UserPanel extends React.Component {
	state = {
		user: this.props.currentUser
	}

	dropDownOptions = () => [
		{
			key: 'avatar',
			text: <span>Change Avatar</span>
		},
		{
			key: 'logout',
			text: <span onClick={this.handleLogout}>Log Out</span>
		}
	];

	/**
	 * Sign out user
	 */
	handleLogout = () => {
		firebase.auth().signOut();
	}

	render() {
		const { user } = this.state;

		return (
			<Grid style={{ background: '#4c3c4c' }}>
				<Grid.Column>
					<Grid.Row style={{ padding: '1.2em', margin: 0 }}>
						<Header inverted floated="left" as="h2">
							<Icon name="comments" />
							<Header.Content>Chat</Header.Content>
						</Header>
					</Grid.Row>

					<Header inverted as="h4" style={{ padding: '1em' }}>
						<Dropdown trigger={
							<span>
								<Image src={user.photoURL} spaced="right" avatar />
								{user.displayName}
							</span>
						} options={this.dropDownOptions()} />
					</Header>
				</Grid.Column>
			</Grid>
		)
	}
}

export default UserPanel;