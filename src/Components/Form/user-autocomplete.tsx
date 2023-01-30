import { AutoComplete, Button, Checkbox, Popover } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AppContext from '../../appContext';
import { getUsers } from '../../transportLayer';
import { EllipsisOutlined } from '@ant-design/icons'


interface IUser {
  name: string
  default: boolean
}
interface UsersProps {
  onChange?(users: IUser[]): void
}
const UserAutoComplete = ({ onChange }: UsersProps) => {
  const orginalOptions = useRef([]);
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([])
  const [selectValue, setSelectValue] = useState<string>()

  useEffect(() => {
    onChange(selectedUsers)
  }, [selectedUsers])
  useEffect(() => {
    getUsers().then((users) => {
      orginalOptions.current = users;
      setOptions(users);
    })
  }, []);


  const onSearch = (searchText: string) => {
    setOptions(
      orginalOptions.current.filter(o => o.label.indexOf(searchText) > -1)
    );
  };

  const onSelect = (data: string) => {
    setSelectValue(data)

  };

  const onChangeCheckBox = (user: IUser) => {
    if (!user.default) {
      const users: IUser[] = selectedUsers.map(x => {
        if (x.name === user.name) {
          x.default = true
        } else x.default = false
        return x
      })
      setSelectedUsers(users)
    }
  }

  const onDeleting = (name: string) => {
    setSelectedUsers(prev => prev.filter(x => x.name !== name))
  }

  const content = (name: string) => {
    return (
      <div >
        <Button onClick={() => onDeleting(name)} >حذف</Button>
      </div>
    )
  }

  return (
    <>
      <AutoComplete
        value={selectValue}
        options={options.filter(option => !selectedUsers.map(x => x.name).includes(option.label))}
        style={{ width: 200 }}
        onSelect={onSelect}
        onSearch={onSearch}
        placeholder="جستجوی کاربر"
      />
      <Button onClick={() => {
        if (selectValue) {
          setSelectedUsers(prev => [...prev, { name: selectValue, default: selectedUsers.map(x => x.default).includes(true) ? false : true }])
          setSelectValue(undefined)
        } else {
          console.log('please choose a user first')
        }
      }}>افزودن</Button>
      <div style={{ marginTop: '24px' }}>
        {selectedUsers.length ? <table dir='rtl' >
          <tbody>
            <tr>
              <th className='table-header'>عملیات</th>
              <th className='table-header'>پیش فرض</th>
              <th className='table-header'>نام</th>
            </tr>
            {selectedUsers.map((x, index) => {
              return (<tr key={index}>
                <td align='center'>
                  <Popover content={() => content(x.name)} title="عملیات">
                    <EllipsisOutlined />
                  </Popover>
                </td>
                <td align='center'><Checkbox checked={x.default} onChange={() => onChangeCheckBox(x)} /></td>
                <td align='center'>{x.name}</td>
              </tr>)
            })}
          </tbody>
        </table> : null}
      </ div>
    </>
  );
};

export default UserAutoComplete;