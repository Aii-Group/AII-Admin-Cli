import { isMicroAppEnv } from '@/utils/micro.ts'
import { useMenuCollapseStore } from '@/stores/system'

import Main from '../Main'
import Header from '../Header'
import Sidebar from '../Sidebar'

const FullMode: React.FC = () => {
    const { collapsed } = useMenuCollapseStore()
    return (
        <>
            {!isMicroAppEnv ? (
                <>
                    <Header />
                    <div className="flex gap-10 p-10">
                        <Sidebar />
                        <div
                            style={{
                                width: collapsed ? 'calc(100vw - 80px)' : 'calc(100vw - 270px)',
                            }}
                        >
                            <Main />
                        </div>
                    </div>
                </>
            ) : (
                <div className="w-full">
                    <Main />
                </div>
            )}
        </>
    )
}
export default FullMode
