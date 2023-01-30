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
	updateNode: (key: string, data: NodeType) => Promise<boolean>
}

function FormComponent({ item, updateNode }: Props) {
	const [access, setAccess] = useState<CheckboxValueType[]>([])
	const [form] = Form.useForm()

	const handleSave = () => {
		form.validateFields().then(x => {
			updateNode(x.key, { ...x, accesses: x.accesses ?? [] }).then(resetForms)
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
							<BasicInformation initialValue={item} form={form} />
						</div>
					</Tabs.TabPane>
					<Tabs.TabPane tab="دسترسی ها" key="item-2">
						<div className='form-content'>
							<ErrorBoundry>
								<Accesses initialValue={item?.accesses} onChange={setAccess} form={form} />
							</ErrorBoundry>
						</div>
					</Tabs.TabPane>
				</Tabs>

			</div>
			<ActionBar actions={[{ title: 'ذخیره', handler: handleSave }]} />
		</div>
	);
}
export default FormComponent