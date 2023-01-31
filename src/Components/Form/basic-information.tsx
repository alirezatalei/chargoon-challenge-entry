import { Button, Form, FormInstance, Input } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../appContext';
import { NodeType } from '../../types';
import UserAutoComplete from './user-autocomplete';

interface Props {
	initialValue?: NodeType;
	onFinish?(values: any): void
	form: FormInstance<any>
}

function BasicInformation({ onFinish, initialValue, form }: Props) {
	const { treeData } = useContext(AppContext)


	const fetchIds = (): string[] => {
		const ids: string[] = [];
		JSON.stringify(treeData, (key, treeValue) => {
			if (key === 'key' && !(initialValue && initialValue?.key === treeValue)) ids.push(treeValue);
			return treeValue
		});
		return ids
	}

	return (
		<Form form={form} onFinish={onFinish}>
			<Form.Item initialValue={initialValue?.title}
				rules={[{ required: true, message: 'عنوان الزامسیست' }]}
				name="title" label="عنوان" labelCol={{ span: 2 }}
			>
				<Input />
			</Form.Item>
			<Form.Item initialValue={initialValue?.key}
				rules={[{
					required: true,
					validator: (_, value) => value ? fetchIds().includes(value) ? Promise.reject(new Error('کد تکراریست')) : Promise.resolve() : Promise.reject(new Error('کد الزامسیست'))
				}]}
				name="key" label="کد" labelCol={{ span: 2 }}>
				<Input readOnly={initialValue?.key ? true : false} />
			</Form.Item>
			<Form.Item name="users" label="کاربران" labelCol={{ span: 2 }}>
				<UserAutoComplete initialValue={initialValue} />
			</Form.Item>
		</Form>
	);
}
export default BasicInformation