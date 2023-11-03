import ContactsTable from '@/components/UsersTable'
import Box from '@mui/material/Box'
import Head from 'next/head'

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>CRM - DataCrazy</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='theme-color' content='#000000' />
        <meta name='description' content={`CRM - DataCrazy`} />
        <meta name='keywords' content='contacts, management, app' />
        <meta name='author' content='Flaviano Vilhena' />
      </Head>
      <Box sx={{ width: '100%' }} component='section'>
        <ContactsTable />
      </Box>
    </>
  )
}

export default Home
