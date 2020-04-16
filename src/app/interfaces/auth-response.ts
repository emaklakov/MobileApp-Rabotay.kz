export interface IAuthResponse {
	access_token: string;
	user: {
		id: string,
		first_name: string,
		last_name: string,
		middle_name: string,
		phone: string,
		location_id: string,
		location_name: string,
		avatar_image: string,
		status: number,
	}
}
