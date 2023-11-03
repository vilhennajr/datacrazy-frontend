import { ContactsTableProps, Data, IHeadCell } from '@/types'
import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import { visuallyHidden } from '@mui/utils'

const headCells: readonly IHeadCell[] = [
  {
    _id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Nome',
  },
  {
    _id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'E-mail',
  },
  {
    _id: 'mobile_phone',
    numeric: false,
    disablePadding: false,
    label: 'Telefone',
  },
  {
    _id: 'createdAt',
    numeric: false,
    disablePadding: false,
    label: 'Criado em',
  },
  {
    _id: 'options',
    numeric: false,
    disablePadding: true,
    label: 'Ações',
  },
]

const ContactsTableHead: React.FC<ContactsTableProps> = (
  props: ContactsTableProps
) => {
  const { order, orderBy, onRequestSort } = props

  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, idx) => (
          <TableCell
            key={headCell._id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell._id ? order : false}
            sx={{
              pl: idx === 0 ? '2rem' : '1rem',
            }}
          >
            <TableSortLabel
              active={orderBy === headCell._id}
              direction={orderBy === headCell._id ? order : 'asc'}
              onClick={createSortHandler(headCell._id)}
            >
              {headCell.label}
              {orderBy === headCell._id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export default ContactsTableHead
