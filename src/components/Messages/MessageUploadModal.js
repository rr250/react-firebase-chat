import React from 'react';
import mimeType from 'mime-types';
import { Modal, Input, Button } from 'semantic-ui-react';

 class MessageUploadModal extends React.Component {
	state = {
		file: null,
		allowedTypes: ['image/jpeg', 'image/png'] 
	}

	/**
	 * Add file to state
	 */
	addFile = (event) => {
		const file = event.target.files[0];

		if (file !== null & typeof file !== 'undefined') {
			this.setState({ file });
		} else {
			this.clearFile();
		}
	}

	/**
	 * Is selected image a valid type (set in state)?
	 */
	isAllowedType = (fileName) => {
		return this.state.allowedTypes.includes(mimeType.lookup(fileName));
	}

	/**
	 * Send file to parent component via upload function prop
	 */
	sendFile = () => {
		const { file } = this.state;
		const { uploadFile, closeModal } = this.props;

		if (file !== null) {
			if (this.isAllowedType(file.name)) {
				const metadata = { contentType: mimeType.lookup(file.name) }
				uploadFile(file, metadata);
				closeModal();
				this.clearFile();
			}
		}
	}

	/**
	 * Clear file from state
	 */
	clearFile = () => {
		this.setState({ file: null });
	}
	
	render() {
		const { modal, closeModal } = this.props;

		return (
			<Modal size="tiny" open={modal}>
				<Modal.Header>Select Image to Upload</Modal.Header>
				<Modal.Content>
					<Input 
						fluid
						label="Image"
						name="file"
						type="file"
						onChange={this.addFile}
					/>
				</Modal.Content>
				<Modal.Actions>
					<Button disabled={this.state.file === null} onClick={this.sendFile} primary>Upload</Button>
					<Button onClick={closeModal}>Cancel</Button>
				</Modal.Actions>
			</Modal>
		);
	 }
 }

 export default MessageUploadModal;