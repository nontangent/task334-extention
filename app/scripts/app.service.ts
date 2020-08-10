import * as moment from 'moment';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import {
	TODO,
	User,
	Task,
	TaskStatus
} from './models';

let test = null;

const firebaseConfig = {
  apiKey: "AIzaSyBRCKehewx-LCseRzzLK0wvfWMukpyVxAo",
  authDomain: "task334-c700c.firebaseapp.com",
  databaseURL: "https://task334-c700c.firebaseio.com",
  projectId: "task334-c700c",
  storageBucket: "task334-c700c.appspot.com",
  messagingSenderId: "693501868980",
  appId: "1:693501868980:web:e8882bd1970cb3307390e1",
  measurementId: "G-8SE9B7ZMQN"
};

export class AppService {
	private static _instance: AppService;
	private db: TODO<any>;
	user$ = new BehaviorSubject<TODO<User>>(null);
	tasks$ = new BehaviorSubject<TODO<Task>[]>([]);
	count$ = new BehaviorSubject<number>(0);
	lastUpdatedAt$ = new BehaviorSubject<moment.Moment>(moment());

	private constructor() {
		firebase.initializeApp(firebaseConfig);
		this.db = firebase.firestore();

		firebase.auth().onAuthStateChanged((user: TODO<User>) => {
			if (user) {
				this.user$.next(user);
				
				this.getTasks(user.uid, {status: TaskStatus.WIP}).onSnapshot((snapshot: TODO<any>) => {
					const tasks: TODO<Task>[] = snapshot?.docs?.map((doc: any) => {
						return doc.data()
					});
					this.tasks$.next(tasks);
				}); 

				this.getWeeklyTasks(user.uid, {status: TaskStatus.DONE}).onSnapshot((snapshot: TODO<any>) => {
					let count = 0;
					snapshot.forEach((doc: TODO<any>) => {
						count += 1;
					});

					this.count$.next(count);

					const lastUpdatedAt: moment.Moment = moment(snapshot?.docs[snapshot?.docs?.length - 1].data().updatedAt.toDate());
					this.lastUpdatedAt$.next(lastUpdatedAt);
					console.log('lastUpdatedAt:', lastUpdatedAt);
				});

			}
		});

		firebase.auth().getRedirectResult().then((result) => {
			console.log('result:', result);
		}).catch((error) => {
			console.error(error);
		});

	}

	getTasks(userId: string, params: {status: TaskStatus}) {
		return this.db.collection('users').doc(userId).collection('tasks')
			.where('status', '==', params.status).orderBy('updatedAt');
	}

	getWeeklyTasks(userId: string, params: {status: TaskStatus}) {
		return this.db.collection('users').doc(userId).collection('tasks')
			.where('status', '==',params.status).where('updatedAt', '>=', monday().toDate());
	}

	signUp() {
		var provider = new firebase.auth.TwitterAuthProvider();
		let user;
		firebase.auth().signInWithRedirect(provider).then((result: any) => {
		  var token = result.credential.accessToken;
		  var secret = result.credential.secret;
		  user = result.user;
		  console.log('user:', user)
		}).catch((error) => {
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  var email = error.email;
		  var credential = error.credential;
		  console.error(error);
		});
	}

	public static get instance(): AppService {
		if (!this._instance) {
			this._instance = new AppService;
		}

		return this._instance;
	}

}

function monday() {
	return moment().subtract(moment().isoWeekday() - 1, 'days')
		.hours(0).minutes(0).seconds(0).milliseconds(0);
}

