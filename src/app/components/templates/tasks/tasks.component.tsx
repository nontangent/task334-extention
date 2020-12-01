import * as React from 'react';
import * as moment from 'moment';
import { interval } from 'rxjs';
import * as operators from 'rxjs/operators';
import { AppService } from '../../../app.service';
import * as models from '@task334/models';

interface Props {

}

interface State {
	tasks: models.Task[];
	count: number;
	lastUpdatedAt: moment.Moment;
	message: string;
}

export class TasksTemplate extends React.Component<Props, State> {
	// private state: State;
	private appService: AppService;

	constructor(props: Props) {
		super(props);
		this.state = {
			tasks: [
			],
			count: 0,
			lastUpdatedAt: moment(),
			message: ''
		};

		this.appService = AppService.instance;
	}

	componentDidMount() {
		this.appService.tasks$.pipe(
			operators.distinctUntilChanged((pre: models.Task[], cur: models.Task[]) => {
				return JSON.stringify(pre) === JSON.stringify(cur);
			}),
			operators.map((tasks) => {
				return tasks.sort((a, b) => a.name.localeCompare(b.name))
			})
		).subscribe((tasks: models.Task[]) => {
			this.setState({tasks: tasks});
		});

		this.appService.count$.pipe(
			operators.distinctUntilChanged<number>()
		).subscribe((count: number) => {
			this.setState({count: count});
		});

		this.appService.lastUpdatedAt$.pipe(
			operators.distinctUntilChanged<moment.Moment>()
		).subscribe((lastUpdatedAt) => {
			this.setState({lastUpdatedAt: lastUpdatedAt});
		});

		interval(1000).subscribe((_: number) => {
			this.setState({message: this.calcDuration(this.state.lastUpdatedAt)});
		});
	}

	calcDuration(lastUpdatedAt: moment.Moment) {
		return formatDuration(moment.duration(moment().diff(lastUpdatedAt)));
	}
  
	render() {
		return (
			<div className="tasks-template">
				<h2>いまなにする？</h2>
				<ol>
					{this.state.tasks.map((task: models.Task) => <li>{task.name}</li>)}
				</ol>
				<div>
					<span>#TASK334</span>
					<span>完了したタスク数({this.state.count})</span><br />
					<span>{this.state.message}</span>
				</div>
			</div>
		)
	}
}

function formatDuration(duration: moment.Duration): string {
	let str = '最後のタスク完了から';
	str += duration.days() ? `${duration.days()}日` : '';
	str += duration.hours() ? `${duration.hours()}時間` : '';
	str += duration.minutes() ? `${duration.minutes()}分` : '';
	str += duration.seconds() ? `${duration.seconds()}秒` : '';
	str += 'が経過';
	return str;
}

