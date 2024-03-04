import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = (
    <LoadingOutlined
        style={{
            fontSize: 35,
            color: `#fff`,
            
        }}
        spin
    />
);

const Loader = () => {
    return (
        <div className="spin_loader">
            <Spin indicator={antIcon} />
        </div>
    )
}

export default Loader