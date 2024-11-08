import ContactsTableHead from '@/components/UsersTable/UsersTableHead'
import ContactsTableToolbar from '@/components/UsersTable/UsersTableToolbar'
import ActionsMenu from '@/components/UI/ActionsMenu'
import {
  useDeleteContactMutation,
  useGetContactsListQuery,
} from '@/lib/contactsApi'
import { Data, Order } from '@/types'
import { Cancel, Delete, Error, Group } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'

import Divider from '@mui/material/Divider'
import { useRouter } from 'next/router'
import { FC, MouseEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const ContactsTable: FC = () => {
  const router = useRouter()
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof Data>('createdAt')
  const [page, setPage] = useState(0)
  const [rows, setRows] = useState<readonly Data[]>([])
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState<string>('')
  const [isRefetching, setIsSleep] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [cachedId, setCachedId] = useState<string | undefined>(undefined)

  const [deleteContact] = useDeleteContactMutation()
  const { data, error, isLoading, isFetching, refetch } =
    useGetContactsListQuery(
      {
        page,
        perPage: rowsPerPage,
        _sort: order,
        _orderBy: orderBy,
        _contains: search || undefined,
      },
      {
        refetchOnMountOrArgChange: true,
      }
    )

  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleOnSearch = (search: string) => {
    setPage(0)
    setSearch(search)
  }

  const handleDelete = async (id?: string) => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setCachedId(id)
      return
    }

    const res = await deleteContact({ _id: cachedId || id })

    if (res?.data?._id) {
      router.push('/').then(() => {
        toast('Usuário excluído com sucesso', {
          type: 'success',
        })
      })
    }

    toast(res?.error?.data?.message, {
      type: 'error',
    })
    setConfirmDelete(false)
    setCachedId(undefined)
    refetch()
  }

  const isEmpty: Boolean = data?.results?.length === 0

  useEffect(() => {
    if (data) {
      setRows(data.results)
    }
  }, [data])

  useEffect(() => {
    if (isFetching) {
      setIsSleep(true)
    } else {
      setTimeout(() => {
        setIsSleep(false)
      }, 200)
    }
  }, [isFetching])

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          width: '100%',
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh',
        }}
      >
        <Error
          sx={{ fontSize: 100, color: 'grey.500', marginBottom: '20px' }}
        />
        <Typography variant='h6' component='div' gutterBottom fontWeight='bold'>
          Something went wrong, please try again later
        </Typography>
        <Button
          variant='text'
          color='info'
          size='large'
          sx={{
            marginTop: '',
            fontWeight: 'bold',
            textTransform: 'capitalize',
            fontSize: '1.15rem',
          }}
          onClick={() => router.reload()}
        >
          Reload page
        </Button>
      </Box>
    )
  }

  return (
    <>
      <Box sx={{ width: '100%', maxWidth: '72rem', pt: { md: 2 } }}>
        <ContactsTableToolbar onSearch={handleOnSearch} />

        <Divider sx={{ marginBottom: '1rem' }} />

        <Paper
          sx={{
            width: '100%',
            mb: 2,
            borderRadius: '1rem',
            height: '100%',
            maxHeight: {
              xs: 'calc(100vh - 250px)',
              md: 'calc(100vh - 200px)',
            },
            overflow: 'auto',
          }}
        >
          <TableContainer>
            <Table
              aria-labelledby='tableTitle'
              size={'medium'}
              sx={{ position: 'relative' }}
            >
              <ContactsTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rowsPerPage}
              />

              <TableBody>
                {isRefetching && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      sx={{
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: '100%',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          zIndex: 1,
                          backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    </TableCell>
                  </TableRow>
                )}

                {!isEmpty ? (
                  rows?.map((row, idx) => {
                    return (
                      <TableRow
                        role='row'
                        key={row._id}
                        hover
                        sx={{
                          cursor: 'pointer',
                          '&:last-child td, &:last-child th': {
                            border: 0,
                          },
                        }}
                      >
                        <TableCell
                          component='th'
                          align='left'
                          sx={{
                            pl: '2rem',
                          }}
                        >
                          {row.name}
                        </TableCell>
                        <TableCell component='th' align='left'>
                          {row.email}
                        </TableCell>
                        <TableCell component='th' align='left'>
                          {row.mobile_phone}
                        </TableCell>
                        <TableCell component='th' align='left'>
                          {new Date(row.createdAt).toLocaleString('pt-BR')}
                        </TableCell>
                        <TableCell component='th' align='center'>
                          <ActionsMenu
                            id={row._id}
                            onDelete={() => handleDelete(row._id)}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align='center' sx={{ py: 3 }}>
                      <Group sx={{ fontSize: 100, color: 'grey.500' }} />
                      <Typography
                        variant='h6'
                        component='div'
                        gutterBottom
                        fontWeight='bold'
                      >
                        Nenhum usuário encontrado
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component='div'
            count={data?.count || rows?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10))
              setPage(0)
            }}
          />
        </Paper>
      </Box>

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <Card
            variant='elevation'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              padding: '1rem',
              width: '300px',
              height: '200px',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '0.5rem',
            }}
          >
            <Typography variant='h5' color='inherit' fontWeight={600}>
              Tem certeza?
            </Typography>

            <Typography variant='body1' color='inherit'>
              Essa ação não pode ser desfeita.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                gap: '0.5rem',
              }}
            >
              <Button
                variant='contained'
                color='error'
                fullWidth
                size='large'
                onClick={() => handleDelete()}
              >
                <Delete />
                <Typography
                  variant='button'
                  color='inherit'
                  fontWeight={600}
                  fontSize='1.15rem'
                  sx={{ textTransform: 'capitalize' }}
                >
                  Excluir
                </Typography>
              </Button>

              <Button
                variant='contained'
                color='primary'
                fullWidth
                size='large'
                onClick={() => setConfirmDelete(false)}
                sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Cancel />
                <Typography
                  variant='button'
                  color='inherit'
                  fontWeight={600}
                  fontSize='1.15rem'
                  sx={{ textTransform: 'capitalize' }}
                >
                  Cancelar
                </Typography>
              </Button>
            </Box>
          </Card>
        </Box>
      </Modal>
    </>
  )
}

export default ContactsTable
