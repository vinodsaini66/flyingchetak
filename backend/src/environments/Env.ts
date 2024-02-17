import { CONASTANT } from "../constants/project.enum";

export interface Environment {
	nodeEnv: string;
	dbUrl: string;
	baseUrl: string;
	jwtSecret: string;
	jwt_timeout:string,
	redirection_url:string,
	awsSecretKey: string;
	awsAccessKey: string;
	region: string;
	s3Bucket: string;
}

export function env(): Environment {
	return {
		nodeEnv: process.env.NODE_ENV,
		dbUrl: CONASTANT.DB_URL,
		baseUrl: CONASTANT.BASE_URL,
		jwtSecret:CONASTANT.JWT_SECRET,
		redirection_url:CONASTANT.REDIRECTION_URL,
		jwt_timeout:CONASTANT.JWT_TIMEOUT_DURATION,
		awsSecretKey: process.env.aws_access_key,
		awsAccessKey: process.env.aws_secret_key,
		region: process.env.region,
		s3Bucket: process.env.s3_bucket,
	};
}
