import React from 'react';

function Feature(props) {
	return (
		<div className='row' style={{ marginBottom: '1rem' }}>
			<div className='col-md-6' data-aos='fade-up-right'>
				<h2 className='primaryColor'>{props.head}</h2>

				<p className='italic text-md'>{props.text}</p>
			</div>
			<div className='col-md-6' data-aos='fade-left'>
				<img src={props.pic} alt='pic' />
			</div>
		</div>
	);
}

export default Feature;
