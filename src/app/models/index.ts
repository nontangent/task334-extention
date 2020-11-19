import * as moment from 'moment';

export type TODO<T> = any;

export interface User {

}

export enum TaskStatus {
	WIP = 0,
	DONE = 1,
	LEFT = 2
}

export interface Task {
	name: string;
	status: TaskStatus;
	createdAt: moment.Moment;
	updatedAt: moment.Moment;
}

export interface Twitter {
	id: string;
	accessToken: string;
	secret: string;
}
