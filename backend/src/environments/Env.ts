export interface Environment {
	nodeEnv: string;
	dbUrl: string;
	baseUrl: string;
	awsSecretKey: string;
	awsAccessKey: string;
	region: string;
	s3Bucket: string;
}

export function env(): Environment {
	return {
		nodeEnv: process.env.NODE_ENV,
		dbUrl: process.env.DB_URL,
		baseUrl: process.env.BASE_URL,
		awsSecretKey: process.env.aws_access_key,
		awsAccessKey: process.env.aws_secret_key,
		region: process.env.region,
		s3Bucket: process.env.s3_bucket,
	};
}
