import React from "react";
import "antd/dist/antd.css";
import "./App.css";
import { Table, Icon, Form, Input, Select, InputNumber, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";
import { errorMessage } from "./helpers";
import TextArea from "antd/lib/input/TextArea";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          date: "",
          description: "",
          credit: "",
          debit: "",
          add: "",
          color: "#fff",
        },
        {
          date: "Date",
          description: "Description",
          credit: "Credit",
          debit: "Debit",
          add: "Running Balance",
          color: "#0000EE",
        },
      ],
      addTransactionModalVisible: false,
      currTransactionType: undefined,
      currAmount: "",
      currDescription: "",
    };
  }

  handleOk = (e) => {
    let validate = true;
    if (!this.state.currTransactionType) {
      validate = false;
      return errorMessage("Transaction Type is mandatory");
    }
    if (this.state.currAmount === 0 || this.state.currAmount === "") {
      validate = false;
      return errorMessage("Amount is mandatory");
    }

    const data = [...this.state.data];
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;
    let totalCredit = 0;
    if (data.length > 2) {
      data.slice(2).forEach((a) => {
        if (!isNaN(a.credit)) {
          totalCredit += a.credit;
        }
      });
      if (this.state.currTransactionType === "credit") {
        totalCredit += this.state.currAmount;
      }
    } else {
      if (this.state.currTransactionType === "credit") {
        totalCredit += this.state.currAmount;
      }
    }
    let totalDebit = 0;
    if (data.length > 2) {
      data.slice(2).forEach((a) => {
        if (!isNaN(a.debit)) {
          totalDebit += a.debit;
        }
      });
      if (this.state.currTransactionType === "debit") {
        totalDebit += this.state.currAmount;
      }
    } else {
      if (this.state.currTransactionType === "debit") {
        totalDebit += this.state.currAmount;
      }
    }
    console.log(totalCredit, totalDebit);
    const totalBalance = totalCredit - totalDebit;
    const currData = {
      date: today,
      description: this.state.currDescription,
      credit:
        this.state.currTransactionType === "credit"
          ? this.state.currAmount
          : "-",
      debit:
        this.state.currTransactionType === "debit"
          ? this.state.currAmount
          : "-",
      add: totalBalance,
      color: "#fff",
    };

    data.splice(2, 0, currData);

    this.setState({
      data,
      currTransactionType: undefined,
      currAmount: "",
      currDescription: "",
      addTransactionModalVisible: false,
    });
  };

  handleCancel = (e) => {
    this.setState({
      currTransactionType: undefined,
      currAmount: "",
      currDescription: "",
      addTransactionModalVisible: false,
    });
  };

  render() {
    const columns = [
      {
        title: <h2>Office Transaction</h2>,
        dataIndex: "date",
        key: "date",
        width: "20%",
        render(text, record) {
          return {
            props: {
              style: { background: record.color },
            },
            children: <div>{text}</div>,
          };
        },
      },
      {
        title: "",
        dataIndex: "description",
        key: "description",
        width: "40%",
        render(text, record) {
          return {
            props: {
              style: { background: record.color },
            },
            children: <div>{text}</div>,
          };
        },
      },
      {
        title: "",
        dataIndex: "credit",
        key: "credit",
        width: "10%",
        render(text, record) {
          return {
            props: {
              style: { background: record.color },
            },
            children: <div>{text}</div>,
          };
        },
      },
      {
        title: "",
        dataIndex: "debit",
        key: "debit",
        width: "10%",
        render(text, record) {
          return {
            props: {
              style: { background: record.color },
            },
            children: <div>{text}</div>,
          };
        },
      },
      {
        title: (
          <h2>
            <PlusOutlined
              onClick={() =>
                this.setState({ addTransactionModalVisible: true })
              }
            />{" "}
            Add Transaction
          </h2>
        ),
        dataIndex: "add",
        key: "add",
        width: "20%",
        render(text, record) {
          return {
            props: {
              style: { background: record.color },
            },
            children: <div>{text}</div>,
          };
        },
      },
    ];
    return (
      <div>
        <Table
          columns={columns}
          dataSource={this.state.data}
          bordered
          pagination={false}
        />
        <Modal
          title="Add Transaction"
          visible={this.state.addTransactionModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="save" type="primary" onClick={this.handleOk}>
              Save
            </Button>,
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
          ]}
          destroyOnClose
        >
          <Form {...layout} name="basic">
            <Form.Item
              label="Transaction Type"
              name="username"
              rules={[
                { required: true, message: "Please select Transaction Type!" },
              ]}
            >
              <Select
                placeholder="Select Transaction Type"
                onChange={(val) => this.setState({ currTransactionType: val })}
                defaultValue={this.state.currTransactionType}
              >
                <Select.Option value="credit">Credit</Select.Option>
                <Select.Option value="debit">Debit</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Amount"
              name="amount"
              rules={[{ required: true, message: "Please input amount!" }]}
            >
              <InputNumber
                placeholder="Enter amount"
                onChange={(val) => this.setState({ currAmount: val })}
                value={this.state.currAmount}
              />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <TextArea
                placeholder="Enter description"
                onChange={(e) =>
                  this.setState({ currDescription: e.target.value })
                }
                showCount
                maxLength={100}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
