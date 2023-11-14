import { useContext, useEffect, useRef, useState } from "react"
import { WebSocketContext } from "../contexts/WebSocketContext"

const NEW_BETTING = "newBetting"
type BettingDto = {
    cid: string;
    count: number;
    command: string;
    mid?: number;
};

type ProcessedBettingDto = {
    cid: string;
    idx: number;
    command: string;
    mid?: number;
};
export const Betting = () => {
    const socket = useContext(WebSocketContext);
    const [cid, setCid] = useState('')
    const [count, _setCount] = useState('')
    const [from, setFrom] = useState(new Date())
    const [mid, setMid] = useState('')
    const [to, _setTo] = useState(new Date())
    const myToRef = useRef(to);
    const setMyTo = (data: any) => {
        myToRef.current = data;
        _setTo(data);
    };
    const myCountRef = useRef(count);
    const setMyCount = (data: any) => {
        myCountRef.current = data;
        _setCount(data);
    };
    const [idx, _setIdx] = useState(0)

    const myIdxRef = useRef(idx);
    const setMyIdx = (data: any) => {
        myIdxRef.current = data;
        _setIdx(data);
    };


    const [isBetting, _setIsbetting] = useState(false)
    const myIsBettingRef = useRef(isBetting);
    const setMyIsBetting = (data: any) => {
        myIsBettingRef.current = data;
        _setIsbetting(data);
    };



    useEffect(() => {
        socket.on('connect', async () => {
           
            if (socket.id) {

                await setCid(socket.id)


            }
        })


        socket.on('processed', async (data: ProcessedBettingDto) => {



            let counter = myCountRef.current
            if (data.mid && data.mid !== parseInt(mid)) {
                await setMid(data.mid.toString())

            }
            const { idx: newIdx } = data;



            if (parseInt(counter) == newIdx) {

                await setMyTo(new Date())

                await setMyIsBetting(false)
                //socket.off('processed')

            }
            await setMyIdx(newIdx)

        })

        return () => {
            console.log('unregistering events...')
            socket.off('connect')
            socket.off('processed')
        }

    }, [])
    /**@ts-ignore */
    const durat = to - from
    return <div style={{ padding: 20 }} >
        <h1>Betting</h1>


        <form>
            <label>

                <input type="number" name="count" onChange={async ({ target: { value } }) => {
                    await setMyCount(value);


                }} value={count} />
            </label>
            <input
                type="button"
                disabled={isBetting}
                style={{ background: isBetting ? 'red' : "green" }}
                value="Send" onClick={async (e) => {
                    await e.preventDefault();
                    const bettingDto: BettingDto = {
                        cid,
                        command: 'enqueue',
                        count: parseInt(count),
                    }

                    if (mid) {
                        bettingDto.mid = parseInt(mid)

                    }

                    await setFrom(new Date())
                    await socket.emit(NEW_BETTING, bettingDto);
                    await setMyIsBetting(true)


                }} />
        </form>
        {(isBetting) && (
            <>
                <p>processing ...</p>

               
            </>
        )}
{idx>0 && (
     <p>Number of element(s) : {idx}/{count}</p>
)}





        <br /><br /><br />
        {
            !isBetting && count && (
                <p> duration : {Math.round(durat) / 1000} seconds</p>
            )
        }

    </div>
}