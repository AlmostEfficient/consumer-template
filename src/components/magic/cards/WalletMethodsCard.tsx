import {useState} from 'react'
import Disconnect from '../wallet-methods/Disconnect'
import Divider from '../../ui/Divider'
import {LoginProps} from '../../../utils/types'
import Card from '../../ui/Card'
import CardHeader from '../../ui/CardHeader'
import {LoginMethod} from '../../../utils/common'
import GetIdToken from '../wallet-methods/GetIdToken'
import GetMetadata from '../wallet-methods/GetMetadata'

import UpdateEmail from '../wallet-methods/UpdateEmail'

const WalletMethods = ({token, setToken}: LoginProps) => {
	const [loginMethod, setLoginMethod] = useState<LoginMethod | null>(
		localStorage.getItem('loginMethod') as LoginMethod
	)
	return (
		<Card>
			<CardHeader id='methods'>Wallet Methods</CardHeader>
			
				{loginMethod && loginMethod == 'EMAIL' && (
					<>
						<UpdateEmail />
						<Divider />
					</>
				)}			
			<GetIdToken />
			<Divider />
			<GetMetadata />
			<Divider />
			<Disconnect token={token} setToken={setToken} />
		</Card>
	)
}

export default WalletMethods
