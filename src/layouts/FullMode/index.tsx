import Main from '@/layouts/Main'
import Header from '@/layouts/Header'
import Sidebar from '@/layouts/Sidebar'
import { isMicroAppEnv } from '@/utils/micro.ts'
import { useMenuCollapseStore } from '@/stores/system'

export default function FullMode() {
    const { collapsed } = useMenuCollapseStore()
    return (
        <>
            {!isMicroAppEnv ? (
                <>
                    <Header />
                    <div className="flex gap-2.5 p-2.5">
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
