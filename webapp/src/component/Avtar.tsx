import { Avatar, Button, Space } from 'antd';
import { useState } from 'react';
import { UpSquareFilled } from '@ant-design/icons';
export const AvatarGenerate = ({name}:any) => {
    const [color, setColor] = useState<string>("orange")
    let url = "https://buffer.com/library/content/images/2023/10/free-images.jpg"
    let nameAvatar = name && name.split("");
    const handleColorChange = () => {
            const letters = '0123456789ABCDEF';
            let color = '#';

            for (let i = 0; i < 6; i++) {
                 color += letters[Math.floor(Math.random() * 16)];
            }
            setColor(color)
    }
    return (
        <Avatar src={url} style={{ backgroundColor: color, verticalAlign: 'middle' }} size={100}  gap={100} onClick={handleColorChange} >
       {/* {name && nameAvatar[0] || "Welcome"} */}
      </Avatar>
    )

}