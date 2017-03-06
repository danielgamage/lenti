import { h, Component } from 'preact'
import style from './style'
import Lenti from 'lenti'

export default class Home extends Component {
	componentDidMount() {
		let lenticulars = document.querySelectorAll('[data-lenticular-list]')
		let instances = []
		// convert → array & loop through
		;[...lenticulars].map((el, i) => {
		  // store instance in array for further manipulation
		  instances[i] = new Lenti({container: el[0], width: 1280, height: 720})
		  // initialize instance
		  instances[i].init()
		})
	}
	render() {
		return (
			<div class={style.home}>
				<h1>Home</h1>
				<div data-lenticular-list="true" >
					<img src="./assets/images/1.jpg" crossorigin="anonymous" alt="" width="1280" height="720" />
					<img src="./assets/images/2.jpg" crossorigin="anonymous" alt="" width="1280" height="720" />
					<img src="./assets/images/3.jpg" crossorigin="anonymous" alt="" width="1280" height="720" />
					<img src="./assets/images/4.jpg" crossorigin="anonymous" alt="" width="1280" height="720" />
			    </div>
			</div>
		);
	}
}
