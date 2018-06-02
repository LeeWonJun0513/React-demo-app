

import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';


// 基础JSX，样式
let style = {
    color: 'r' + 'ed'
};
let jsx = <div className="jsx" style={style}>jsx...</div>;

ReactDOM.render(
    jsx,
    document.getElementById('app')
);


// 数据逻辑处理
let name = 'Dylan';
let names = ['Dylan','Rosen','Geely'];
let flag = false;
let jsx = (
    <div>
        {/* 变量使用 */}
        <p>I am {name}</p>
        {/* 条件判断 */}
        {
            flag ? <p>I am {name}</p> : <p>I am not {name}</p>
        }
        {/* 数组循环 */}
        {
            names.map((name,index) => <p key={index}>Hello, I am {name}</p>)
        }
    </div>
);

ReactDOM.render(
    jsx,
    document.getElementById('app')
);