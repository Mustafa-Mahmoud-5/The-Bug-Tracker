import Particles from 'react-particles-js';

import React from 'react';

function particles() {
	return (
		<div id='particles'>
			<Particles
				params={{
					color: {
						value: '#03a9f4'
					},
					particles: {
						number: {
							value: 80,
							density: {
								enable: true,
								value_area: 800
							}
						},
						color: {
							value: [ '#03a9f4' ]
						},
						shape: {
							type: 'circle',
							stroke: {
								width: 0,
								color: '#03a9f4'
							}
						},
						opacity: {
							value: 0.5211089197812949,
							random: false,
							anim: {
								enable: true,
								speed: 1,
								opacity_min: 0.1,
								sync: false
							}
						},
						size: {
							value: 6.017060304327615,
							random: true,
							anim: {
								enable: true,
								speed: 12.181158184520175,
								size_min: 0.1,
								sync: true
							}
						},
						line_linked: {
							enable: true,
							distance: 150,
							color: '#c8c8c8',
							opacity: 0.4,
							width: 1
						},
						move: {
							enable: true,
							speed: 1,
							direction: 'none',
							random: false,
							straight: false,
							out_mode: 'bounce',
							bounce: false,
							attract: {
								enable: false,
								rotateX: 600,
								rotateY: 1200
							}
						}
					},
					interactivity: {
						detect_on: 'canvas',
						events: {
							onhover: {
								enable: false,
								mode: 'repulse'
							},
							onclick: {
								enable: false,
								mode: 'push'
							},
							resize: true
						},
						modes: {
							grab: {
								distance: 400,
								line_linked: {
									opacity: 1
								}
							},
							bubble: {
								distance: 400,
								size: 40,
								duration: 2,
								opacity: 8,
								speed: 3
							},
							repulse: {
								distance: 200,
								duration: 0.4
							},
							push: {
								particles_nb: 4
							},
							remove: {
								particles_nb: 2
							}
						}
					}
				}}
				height='inherit'
				retina_detect={true}
			/>
		</div>
	);
}

export default particles;
