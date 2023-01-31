import React, { useEffect, useState } from 'react';
import { Checkbox, Form, FormInstance } from 'antd';
import { getAccessList } from '../../transportLayer';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

interface Props {
	initialValue?: any;
	onChange(values: CheckboxValueType[]): void
	form: FormInstance<any>
}

function Accesses({ initialValue, onChange, form }: Props) {
	const [options, setOptions] = useState([]);

	const fetchAccessList = async () => {
		const result: { label: string, id: string }[] = await getAccessList();
		setOptions(result.map(x => x.label));
	}

	useEffect(() => {
		fetchAccessList()
	}, [])


	return (
		<Form form={form}>
			<Form.Item name="accesses" initialValue={[...initialValue ?? []]}>
				<Checkbox.Group options={options} />
			</Form.Item>
		</Form>
	);
}
export default Accesses