import * as moment from 'moment';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import {
	TODO,
	User,
	Task,
	TaskStatus,
	Twitter
} from './models';

let test = null;

const firebaseConfig = {
    apiKey: "AIzaSyBRCKehewx-LCseRzzLK0wvfWMukpyVxAo",
    authDomain: "task334-c700c.firebaseapp.com",
    databaseURL: "https://task334-c700c.firebaseio.com",
    projectId: "task334-c700c",
    storageBucket: "task334-c700c.appspot.com",
    messagingSenderId: "693501868980",
    appId: "1:693501868980:web:b8d5ee65240dc7a77390e1",
    measurementId: "G-43B0RYR4PZ"
  };

export class AppService {
	private static _instance: AppService;
	private db: TODO<any>;
	user: TODO<User>;
	user$ = new BehaviorSubject<TODO<User>>(null);
	tasks$ = new BehaviorSubject<TODO<Task>[]>([]);
	count$ = new BehaviorSubject<number>(0);
	lastUpdatedAt$ = new BehaviorSubject<moment.Moment>(moment());

	private constructor() {

		this.user$.subscribe((user: TODO<User>) => {
			this.user = user;
		})

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

		firebase.auth().getRedirectResult().then((result: any) => {
			console.log('result:', result);
			this.user$.next(result?.user);
			
			if (result?.credential) {
				const twitter: Twitter = {
					id: result?.additionalUserInfo?.profile?.id_str,
					accessToken: result?.credential?.accessToken,
					secret: result?.credential?.secret
				};

				console.log('twitter:', twitter);
				this.saveTwitter(twitter);
			}

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
		// firebase.auth().signInWithRedirect(provider).then((result: any) => {
		// 	var token = result.credential.accessToken;
		// 	var secret = result.credential.secret;
		// 	var user = result.user;
		// 	console.log('user:', user);
		// 	console.log('token:', token);
		// 	console.log('secret:', secret);
		// }).catch((error) => {
		// 	var errorCode = error.code;
		// 	var errorMessage = error.message;
		// 	var email = error.email;
		// 	var credential = error.credential;
		// 	console.error(error);
		// });

		firebase.auth().signInWithPopup(provider).then((result: any) => {
			var token = result.credential.accessToken;
			var secret = result.credential.secret;
			var user = result.user;
			console.log('user:', user);
			console.log('token:', token);
			console.log('secret:', secret);
		}).catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			var email = error.email;
			var credential = error.credential;
			console.error(error);
		});
		  
	}

	saveTwitter(twitter: Twitter) {
		console.log('user:', this.user);

		return this.db.collection('users').doc(this.user.uid).set({
			twitter: twitter
		}, {merge: true});
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

