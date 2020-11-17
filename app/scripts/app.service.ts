import * as moment from 'moment';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import * as models from '@task334/models';
import { M } from '@nontangent/firebase-model-utilities';

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
	private db: firebase.firestore.Firestore;
	user: firebase.User;
	user$ = new BehaviorSubject<firebase.User>(null);
	tasks$ = new BehaviorSubject<models.Task[]>([]);
	count$ = new BehaviorSubject<number>(0);
	lastUpdatedAt$ = new BehaviorSubject<moment.Moment>(moment());

	private constructor() {

		this.user$.subscribe((user: firebase.User) => this.user = user);

		firebase.initializeApp(firebaseConfig);
		this.db = firebase.firestore();

		firebase.auth().onAuthStateChanged((user: firebase.User) => {
			if (user) {
				this.user$.next(user);
				
				this.getTasks(user.uid, {status: models.TaskStatus.WIP}).onSnapshot((snapshot) => {
					const tasks: models.Task[] = snapshot.docs.map((doc: any) => new M({
						...doc.data(),
						id: doc.id,
						ownerId: user.uid
					}).toMoment(firebase.firestore).data());

					this.tasks$.next(tasks);
				}); 

				this.getWeeklyTasks(user.uid, {status: models.TaskStatus.DONE}).onSnapshot((snapshot) => {
					const tasks: models.Task[] = snapshot.docs.map((doc: any) => new M({
						...doc.data(),
						id: doc.id,
						ownerId: user.uid
					}).toMoment(firebase.firestore).data());
					this.count$.next(tasks.length);

					const lastUpdatedAt: moment.Moment = tasks[tasks.length - 1].updatedAt;
					this.lastUpdatedAt$.next(lastUpdatedAt);
					console.debug('lastUpdatedAt:', lastUpdatedAt.format());
				});

			}
		});

	}

	getTasks(userId: string, params: {status: models.TaskStatus}) {
		return this.db.collection('users').doc(userId).collection('tasks')
			.where('status', '==', params.status).orderBy('createdAt');
	}

	getWeeklyTasks(userId: string, params: {status: models.TaskStatus}) {
		return this.db.collection('users').doc(userId).collection('tasks')
			.where('status', '==',params.status).where('updatedAt', '>=', monday().toDate());
	}

	signUp() {
		const provider = new firebase.auth.TwitterAuthProvider();
		
		firebase.auth().signInWithPopup(provider).then((result: firebase.auth.UserCredential) => {
			const userId = result.user.uid;
			const twitter: models.Twitter = {
				id: (result?.additionalUserInfo?.profile as any)?.id_str,
				accessToken: (result?.credential as any)?.accessToken,
				secret: (result?.credential as any)?.secret
			};

			if(result.additionalUserInfo.isNewUser) {
				return this.createUser({
					...models.nullUser,
					id: userId,
					twitter: twitter
				});
			} else {
				return this.updateTwitter(userId, twitter);
			}
		}).catch((error) => {
			console.error(error);
		});
		  
	}

	updateTwitter(userId: string, twitter: models.Twitter) {
		return this.db.doc(`users/${userId}`).set({
			twitter: twitter,
			updatedAt: firebase.firestore.FieldValue.serverTimestamp()
		}, {merge: true});
	}

	createUser(user: models.User) {
		const fields = ['twitter', 'latestTweetId', 'createdAt', 'updatedAt'];
		const data = new M({
			...user,
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			updatedAt: firebase.firestore.FieldValue.serverTimestamp()
		}).toTimestamp(firebase.firestore).filterProps(fields).data()
		return this.db.doc(`users/${user.id}`).set(data);
	}

	public static get instance(): AppService {
		return this._instance || (this._instance = new AppService());
	}

}

function monday() {
	return moment().subtract(moment().isoWeekday() - 1, 'days')
		.hours(0).minutes(0).seconds(0).milliseconds(0);
}

