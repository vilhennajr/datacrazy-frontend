export type Order = 'asc' | 'desc'

export interface IOptions {
  [key: string]: string
}

export interface Data {
  _id: string
  name: string;
  email: string;
  mobile_phone: string;
  createdAt: string;
  options: IOptions
}

export interface IHeadCell {
  disablePadding: boolean
  _id: keyof Data
  label: string
  numeric: boolean
}

export interface ContactsTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void
  order: Order
  orderBy: string
  rowCount: number
}
