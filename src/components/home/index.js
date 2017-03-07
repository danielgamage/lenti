import { h, Component } from 'preact'
import style from './style'
import Lenti from 'lenti'

export default class Home extends Component {
	componentDidMount() {
		let lenticulars = document.querySelectorAll('[data-lenticular-list]')
		let instances = []
		// convert → array & loop through
		;[...lenticulars].map((el, i) => {
			const image = el.querySelector('img')
		  // store instance in array for further manipulation
		  instances[i] = new Lenti({
				container: el,
				width: image.width,
				height: image.height,
				stripWidth: el.getAttribute('data-strip-width')
			})
		  // initialize instance
		  instances[i].init()
		})
	}
	render() {
		return (
			<div class={style.home}>
				<div class={style.main} data-lenticular-list="true" data-strip-width="24">
					<img src="./assets/images/Lenti1.png" crossorigin="anonymous" alt="" width="1920" height="1080" />
					<img src="./assets/images/Lenti2.png" crossorigin="anonymous" alt="" width="1920" height="1080" />
					<img src="./assets/images/Lenti3.png" crossorigin="anonymous" alt="" width="1920" height="1080" />
		    </div>
				<div class={style.small}>
					<div data-lenticular-list="true" data-strip-width="8">
						<img src="./assets/images/Artboard-1.png" crossorigin="anonymous" alt="" width="1024" height="1024" />
						<img src="./assets/images/Artboard-2.png" crossorigin="anonymous" alt="" width="1024" height="1024" />
						<img src="./assets/images/Artboard-3.png" crossorigin="anonymous" alt="" width="1024" height="1024" />
						<img src="./assets/images/Artboard-4.png" crossorigin="anonymous" alt="" width="1024" height="1024" />
			    </div>
				</div>
				Lenticular image viewer
			</div>
		);
	}
}
