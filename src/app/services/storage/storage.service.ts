import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
	providedIn: 'root'
})
export class StorageService {

	constructor(public storage: Storage) { }

	async set(key: string, value: any): Promise<any> {
		try {
			const result = await this.storage.set(key, value);
			//console.log('set string in storage: ' + result);
			return true;
		} catch (reason) {
			//console.log(reason);
			return false;
		}
	}

	async get(key: string) {
		try {
			return await this.storage.get(key);
		} catch (reason) {
			//console.log(reason);
			return null;
		}
	}

	async setObject(key: string, object: Object) {
		try {
			const result = await this.storage.set(key, JSON.stringify(object));
			//console.log('set Object in storage: ' + result);
			return true;
		} catch (reason) {
			//console.log(reason);
			return false;
		}
	}

	async getObject(key: string) {
		try {
			const result = await this.storage.get(key);
			if (result != null) {
				return JSON.parse(result);
			}
			return null;
		} catch (reason) {
			return null;
		}
	}

	public async remove(key: string) {
		return await this.storage.remove(key);
	}

	public clear() {
		this.storage.clear().then(() => {
			console.log('all keys cleared');
		});
	}
}