import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, message } from 'antd';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { AptosClient, Types } from 'aptos';

interface CreateTicketProps {
  onSuccess?: () => void;
}

interface EventFormValues {
  name: string;
  description: string;
  date: number;
  venue: string;
  capacity: number;
  price: number;
}

const CreateTicket: React.FC<CreateTicketProps> = ({ onSuccess }) => {
  const [form] = Form.useForm<EventFormValues>();
  const [loading, setLoading] = useState(false);
  const { account, signAndSubmitTransaction } = useWallet();
  const client = new AptosClient('https://fullnode.devnet.aptoslabs.com/v1');

  const onFinish = async (values: EventFormValues) => {
    if (!account) {
      message.error('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      
      // Convert date to Unix timestamp (seconds)
      const dateTimestamp = Math.floor(new Date(values.date).getTime() / 1000);
      
      const payload: Types.TransactionPayload = {
        type: "entry_function_payload",
        function: `${process.env.REACT_APP_CONTRACT_ADDRESS}::ticket_system::create_event`,
        type_arguments: [],
        arguments: [
          values.name,
          values.description,
          dateTimestamp.toString(),
          values.venue,
          values.capacity.toString(),
          (values.price * 100000000).toString() // Convert APT to octa (1 APT = 100000000 octa)
        ]
      };

      const response = await signAndSubmitTransaction(payload);
      await client.waitForTransaction(response.hash);
      
      message.success('Event created successfully!');
      form.resetFields();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating event:', error);
      message.error('Failed to create event. Please check your wallet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<EventFormValues>
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 400, margin: '0 auto' }}
    >
      <Form.Item
        label="Event Name"
        name="name"
        rules={[{ required: true, message: 'Please input event name!' }]}
      >
        <Input placeholder="Enter event name" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: 'Please input event description!' }]}
      >
        <Input.TextArea placeholder="Enter event description" />
      </Form.Item>

      <Form.Item
        label="Date"
        name="date"
        rules={[{ required: true, message: 'Please select event date!' }]}
      >
        <Input type="datetime-local" />
      </Form.Item>

      <Form.Item
        label="Venue"
        name="venue"
        rules={[{ required: true, message: 'Please input venue!' }]}
      >
        <Input placeholder="Enter venue" />
      </Form.Item>

      <Form.Item
        label="Capacity"
        name="capacity"
        rules={[{ required: true, message: 'Please input capacity!' }]}
      >
        <InputNumber
          min={1}
          placeholder="Enter capacity"
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        label="Price (APT)"
        name="price"
        rules={[{ required: true, message: 'Please input price!' }]}
      >
        <InputNumber
          min={0.1}
          step={0.1}
          placeholder="Enter price in APT"
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={loading}
          block
        >
          Create Event
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateTicket;