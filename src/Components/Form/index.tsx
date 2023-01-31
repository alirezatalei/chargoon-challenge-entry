import { Input, Tabs, Form, Button } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../appContext';
import ErrorBoundry from '../../ErrorBoundry';
import { NodeType } from '../../types';
import ActionBar from '../ActionBar';
import ArrowDownIcon from '../SvgIcons/arrow-down';
import ArrowUpIcon from '../SvgIcons/arrow-up';
import Accesses from './accesses';
import BasicInformation from './basic-information';
import UsersList from './user-autocomplete';

interface Props {
	item: NodeType;
	updateNode: (key: string, data: NodeType, type: 'edit' | 'save') => Promise<boolean>
	nodeToEdit: NodeType
}

function FormComponent({ item, updateNode, nodeToEdit }: Props) {
	const [access, setAccess] = useState<CheckboxValueType[]>([])
	const [form] = Form.useForm()

	useEffect(() => {
		resetForms()
	}, [nodeToEdit])

	const handleSave = () => {
		form.validateFields().then(x => {
			updateNode(x.key, { ...x, accesses: x.accesses ?? [] }, 'save').then(x => resetForms())
		})
	}

	const handleEdit = () => {
		form.validateFields().then(x => {
			updateNode(x.key, { ...nodeToEdit, ...x }, 'edit').then(x => {
				resetForms()
			})
		})
	}
	const resetForms = () => {
		form.resetFields()
		setAccess([])
	}

	return (
		<div className='detail'>
			<div style={{ backgroundColor: 'white' }}>
				<Tabs >
					<Tabs.TabPane tab="اطلاعات اصلی" key="item-1">
						<div className='form-content'>
							<BasicInformation initialValue={nodeToEdit} form={form} />
						</div>
					</Tabs.TabPane>
					<Tabs.TabPane tab="دسترسی ها" key="item-2">
						<div className='form-content'>
							<ErrorBoundry>
								<Accesses initialValue={nodeToEdit?.accesses} onChange={setAccess} form={form} />
							</ErrorBoundry>
						</div>
					</Tabs.TabPane>
				</Tabs>

			</div>
			<ActionBar actions={nodeToEdit ? [{ title: 'ذخیره', handler: handleEdit }] : [{ title: 'افزودن', handler: handleSave }]} />
		</div>
	);
}
export default FormComponent