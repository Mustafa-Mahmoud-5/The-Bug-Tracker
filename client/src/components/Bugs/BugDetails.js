// this component will be wrapped in a modal in the projectDetails container
import React from 'react';
import { toDate } from '../../helpers';
import LoadingBtn from '../Btn/LoadingBtn';
function BugDetails(props) {
	const { projectType, selectedBug, loading } = props;

	const selectedBugStatus = selectedBug.status === 1 ? 'Fixed' : 'Buggy';
	const selectedBugStatusColor = selectedBug.status === 1 ? '#5cb85c' : '#d9534f';

	return (
		<div style={{ textAlign: 'center' }}>
			<p style={{ color: selectedBugStatusColor }}>({selectedBugStatus})</p>

			{/* show only if the project type is public */}
			{projectType !== 'public' && (
				<p className='italic secondary'>
					Reported By{' '}
					{`${selectedBug.creator.firstName}  ${selectedBug.creator.lastName} at ${toDate(
						selectedBug.createdAt
					)}`}
				</p>
			)}

			<div style={{ color: 'white', backgroundColor: '#11161A' }}>{selectedBug.description}</div>

			<LoadingBtn
				loading={loading}
				name={selectedBug.status === 1 ? 'Re open' : 'Fix'}
				func={props.updateBugStatus}
			/>
		</div>
	);
}

export default BugDetails;
