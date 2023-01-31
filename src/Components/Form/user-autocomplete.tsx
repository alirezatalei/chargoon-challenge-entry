import { AutoComplete, Button, Checkbox, Popover } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import AppContext from '../../appContext';
import { getUsers } from '../../transportLayer';
import { EllipsisOutlined } from '@ant-design/icons'
import { NodeType, UserType } from '../../types';


interface IUser {
  title: string
  isDefault: boolean
}
interface UsersProps {
  onChange?(users: UserType[]): void
  initialValue: NodeType
}
const UserAutoComplete = ({ onChange, initialValue }: UsersProps) => {
  const orginalOptions = useRef([]);
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([])
  const [selectValue, setSelectValue] = useState<string>()
  useEffect(() => {
    if (initialValue) setSelectedUsers(initialValue.users)
  }, [initialValue])

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
    if (!user.isDefault) {
      const users: UserType[] = selectedUsers.map(x => {
        if (x.title === user.title) {
          x.isDefault = true
        } else x.isDefault = false
        return x
      })
      setSelectedUsers(users)
    }
  }

  const onDeleting = (title: string) => {
    setSelectedUsers(prev => prev.filter(x => x.title !== title))
  }

  const content = (title: string) => {
    return (
      <div >
        <Button onClick={() => onDeleting(title)} >حذف</Button>
      </div>
    )
  }

  return (
    <>
      <AutoComplete
        value={selectValue}
        options={options.filter(option => !selectedUsers.map(x => x.title).includes(option.label))}
        style={{ width: 200 }}
        onSelect={onSelect}
        onSearch={onSearch}
        placeholder="جستجوی کاربر"
      />
      <Button onClick={() => {
        if (selectValue) {
          setSelectedUsers(prev => [...prev, { title: selectValue, isDefault: selectedUsers.map(x => x.isDefault).includes(true) ? false : true }])
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
                  <Popover content={() => content(x.title)} title="عملیات">
                    <EllipsisOutlined />
                  </Popover>
                </td>
                <td align='center'><Checkbox checked={x.isDefault} onChange={() => onChangeCheckBox(x)} /></td>
                <td align='center'>{x.title}</td>
              </tr>)
            })}
          </tbody>
        </table> : null}
      </ div>
    </>
  );
};

export default UserAutoComplete;