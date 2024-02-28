import React, { useEffect } from 'react'
import './index.less';
import {DatePicker,Space, Table, Tag } from 'antd'
import dayjs from 'dayjs';
import more from '../../assets/images/home/more.svg'
import store from '../../redux/store'
import {SideShow} from '../../redux/actionCreator/SideActive'
const { RangePicker } = DatePicker;
export default function Schedule() {
  useEffect(()=>{
    store.dispatch(SideShow(false))
    return()=>{
      store.dispatch(SideShow(true))
    }
  },[])
  const onRangeChange = (dates, dateStrings) => {
    if (dates) {
      console.log('From: ', dates[0], ', to: ', dates[1]);
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    } else {
      console.log('Clear');
    }
  };
  const rangePresets = [
    {
      label: 'Last 7 Days',
      value: [dayjs().add(-7, 'd'), dayjs()],
    },
    {
      label: 'Last 14 Days',
      value: [dayjs().add(-14, 'd'), dayjs()],
    },
    {
      label: 'Last 30 Days',
      value: [dayjs().add(-30, 'd'), dayjs()],
    },
    {
      label: 'Last 90 Days',
      value: [dayjs().add(-90, 'd'), dayjs()],
    },
  ];
  return (
    <div className='schedule'>
      <div className='schedule-header'>
        <RangePicker
          presets={[
            {
              label: <span aria-label="Current Time to End of Day">Now ~ EOD</span>,
              value: () => [dayjs(), dayjs().endOf('day')], // 5.8.0+ support function
            },
            ...rangePresets,
          ]}
          showTime
          format="YYYY/MM/DD HH:mm:ss"
          onChange={onRangeChange}
          suffixIcon={<img src={more} />}
        />
      </div>
      <Tabulation />
    </div>
  )
}

function Tabulation(){
  const columns = [
    {
      title: '',
      dataIndex: 'time',
      key: 'time',
      render: (text) => <span style={{color:'#414D55',fontSize:'10px'}}>{text}</span>,
    },
    {
      title: 'Monday, 28',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Tuesday, 29',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Wednesday, 30',
      key: 'tags',
      dataIndex: 'tags',
    },
    {
      title: 'Thusday, 1',
      key: 'tags',
      dataIndex: 'tags',
    },
    {
      title: 'Friday, 2',
      key: 'tags',
      dataIndex: 'tags',
    },
    {
      title: 'Saturday, 3',
      key: 'tags',
      dataIndex: 'tags',
    },
    {
      title: 'Sunday, 4',
      key: 'tags',
      dataIndex: 'tags',
    },
  ];
  const data = [
    {
      key: '1',
      time: '09:00',
      age: 32,
      address: 'Mandy Tse',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      time: '09:30',
      age: 42,
      address: 'Mandy Tse',
      tags: ['loser'],
    },
    {
      key: '3',
      time: '10:00',
      age: 32,
      address: 'Mandy Tse',
      tags: ['cool', 'teacher'],
    },
  ];
  return (
    <Table bordered columns={columns} dataSource={data} />
  )
}
