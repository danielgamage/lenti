import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style';

export default class Header extends Component {
	render() {
		return (
			<header class={style.header}>
				<h1>Lenti</h1>
				<nav>
					<a href="https://github.com/danielgamage/lenti" target="_blank">
						Github
					</a>
					{/*
						<Link href="/">Home</Link>
						<Link href="/profile">Me</Link>
						<Link href="/profile/john">John</Link>
					*/}
				</nav>
			</header>
		);
	}
}
