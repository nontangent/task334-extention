import * as React from 'react';
import { 
	EntranceTemplate,
	TasksTemplate 
} from './components/templates';
import { AppService } from './app.service';
import { TODO, User } from './models';

enum Modes {
	ENTRANCE = 'entrance',
	TASKS = 'tasks'
}

interface Props { }

interface State {
	mode: Modes;
}

class App extends React.Component<Props, State> {
	private appService: AppService

	constructor(props: Props) {
		super(props);
		this.state = {
			mode: Modes.ENTRANCE
		};

		this.appService = AppService.instance;
	}

	componentDidMount() {
		this.appService.user$.subscribe((user: TODO<User>) => {
			const mode: Modes = user ? Modes.TASKS : Modes.ENTRANCE;
			this.setState({mode: mode});
		});
	}

	render() {
		return (
			<div>
				{ this.state.mode == Modes.ENTRANCE ? <EntranceTemplate /> : <TasksTemplate /> }
			</div>
		);
	}
}


export default App;
