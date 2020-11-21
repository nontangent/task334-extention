import * as moment from 'moment';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import * as models from '@task334/models';
import { M } from '@nontangent/firebase-model-utilities';
import { filter, map } from 'rxjs/operators';

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

firebase.initializeApp(firebaseConfig);

export class AppService {
	private static _instance: AppService;
	private db: firebase.firestore.Firestore = firebase.firestore();
	auth: firebase.User;
	auth$ = new BehaviorSubject<firebase.User>(null);

	uid: string;
	uid$: Observable<string> = this.auth$.pipe(
		map(auth => auth?.uid),
		filter(uid => !!uid)
	);
	tasks$ = new BehaviorSubject<models.Task[]>([]);
	count$ = new BehaviorSubject<number>(0);
	lastUpdatedAt$ = new BehaviorSubject<moment.Moment>(moment());

	private constructor() {

		this.auth$.subscribe((auth: firebase.User) => this.auth = auth);

		firebase.auth().onAuthStateChanged((auth: firebase.User) => {
			this.auth$.next(auth);
		});

		this.uid$.subscribe(uid => {
			this.getTasks(uid, {status: models.TaskStatus.WIP}).onSnapshot((snapshot) => {
				const tasks: models.Task[] = snapshot.docs.map((doc: any) => new M({
					...doc.data(),
					id: doc.id,
					ownerId: uid
				}).toMoment(firebase.firestore).data());

				this.tasks$.next(tasks);
			}); 

			this.getWeeklyTasks(uid, {status: models.TaskStatus.DONE}).onSnapshot((snapshot) => {
				const tasks: models.Task[] = snapshot.docs.map((doc: any) => new M({
					...doc.data(),
					id: doc.id,
					ownerId: uid
				}).toMoment(firebase.firestore).data());
				this.count$.next(tasks.length);

				const lastUpdatedAt: moment.Moment = tasks[tasks.length - 1].updatedAt as moment.Moment;
				this.lastUpdatedAt$.next(lastUpdatedAt);
				console.debug('lastUpdatedAt:', lastUpdatedAt.format());
			});
		});

		firebase.auth().getRedirectResult().then((result: firebase.auth.UserCredential) => {
			const userId = result.user.uid;
			const twitter: models.Twitter = {
				id: (result?.additionalUserInfo?.profile as any)?.id_str,
				accessToken: (result?.credential as any)?.accessToken,
				secret: (result?.credential as any)?.secret
			};

			return this.saveUser({
				id: userId,
				twitter: twitter
			});
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
		return firebase.auth().signInWithRedirect(provider);
	}

	saveUser(user: Partial<models.User>): Promise<void> {
		return this.db.doc(`users/${user.id}`).get().then(doc => {
			return doc.exists ? this.updateUser({
				...doc.data(),
				...user
			} as models.User) : this.createUser(user as models.User);
		});
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

	updateUser(user: models.User): Promise<void> {
		const fields = ['twitter', 'latestTweetId', 'createdAt', 'updatedAt'];
		const data = new M({
			...user,
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

