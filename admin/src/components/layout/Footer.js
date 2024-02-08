import { Layout, Row, Col } from 'antd';
import { HeartFilled } from '@ant-design/icons';

function Footer() {
	const { Footer: AntFooter } = Layout;

	return (
		<AntFooter style={{ background: '#fafafa' }}>
			<Row className='just'>
				<Col xs={24} md={24} lg={24}>
					<div className='copyright'>Copyright © 2023. All right reserved</div>
				</Col>
			</Row>
		</AntFooter>
	);
}

export default Footer;
