import { h, Component } from 'preact'
import style from './style'
import Lenti from 'lenti'
import rebound from 'rebound'

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
				stripWidth: el.getAttribute('data-strip-width'),
				mouseEvents: false
			})
			let _this = instances[i]

			// set up spring
			const springSystem = new rebound.SpringSystem();
			const springConfig = [40, 9] // tension, friction
			const balanceSpring = springSystem.createSpring(...springConfig);
			balanceSpring.addListener({ onSpringUpdate: function(balanceSpring) {
				_this.redraw(balanceSpring.getCurrentValue())
			}})
			// initialize instance
			_this.init()

			// set initial value
			balanceSpring.setEndValue(1)

			// bind mouse events
			_this.canvas.addEventListener('mousemove', (e) => {
				const balance = _this.remap(e.offsetX / _this.canvasWidth, 0, 1, 1, 0)
				balanceSpring.setEndValue(balance)
			})
		})
	}
	render() {
		return (
			<div class={style.home}>
				<div class={style.header}>
					<div class={style.main} data-lenticular-list="true" data-strip-width="24">
						<img src="./assets/images/Lenti1.png" crossorigin="anonymous" alt="" width="1920" height="1080" />
						<img src="./assets/images/Lenti2.png" crossorigin="anonymous" alt="" width="1920" height="1080" />
						<img src="./assets/images/Lenti3.png" crossorigin="anonymous" alt="" width="1920" height="1080" />
			    </div>
					<div class={style.trio}>
						<img src="./assets/images/Lenti1.png" crossorigin="anonymous" alt="" width="1920" height="1080" />
						<img src="./assets/images/Lenti2.png" crossorigin="anonymous" alt="" width="1920" height="1080" />
						<img src="./assets/images/Lenti3.png" crossorigin="anonymous" alt="" width="1920" height="1080" />
					</div>
				</div>
				<h2>Lenticular image viewer</h2>
				<p>Lenti is an image viewer that mimicks the effect of lenticular printing. It displays images in a <code>canvas</code> element and binds events for mouse and accelerometer events, so just as you would rotate a card or print with lenticular lenses on it, you can tilt your phone to transition between images.</p>
				<div class={style.small}>
					<div data-lenticular-list="true" data-strip-width="8">
						<img src="./assets/images/Artboard-1.png" crossorigin="anonymous" alt="" width="1024" height="1024" />
						<img src="./assets/images/Artboard-2.png" crossorigin="anonymous" alt="" width="1024" height="1024" />
						<img src="./assets/images/Artboard-3.png" crossorigin="anonymous" alt="" width="1024" height="1024" />
						<img src="./assets/images/Artboard-4.png" crossorigin="anonymous" alt="" width="1024" height="1024" />
			    </div>
				</div>
				<p>Lenti will accomodate any number of images in the container (be good to your RAM and don&#8217;t go wild, though).</p>
				<p>This page demonstrates how you might tap into the event system and use Lenti with another library like <a href="https://github.com/facebook/rebound-js">Rebound</a> to get smoother interaction.</p>
				<pre><code>{`
import Lenti from 'lenti'
import rebound from 'rebound'

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
		stripWidth: el.getAttribute('data-strip-width'),
		mouseEvents: false
	})
	let _this = instances[i]

	// set up spring
	const springSystem = new rebound.SpringSystem();
	const springConfig = [40, 9] // tension, friction
	const balanceSpring = springSystem.createSpring(...springConfig);
	balanceSpring.addListener({ onSpringUpdate: function(balanceSpring) {
		_this.redraw(balanceSpring.getCurrentValue())
	}})
	// initialize instance
	_this.init()

	// set initial value
	balanceSpring.setEndValue(1)

	// bind mouse events
	_this.canvas.addEventListener('mousemove', (e) => {
		const balance = _this.remap(e.offsetX / _this.canvasWidth, 0, 1, 1, 0)
		balanceSpring.setEndValue(balance)
	})
})
				`}</code></pre>
			</div>
		);
	}
}
