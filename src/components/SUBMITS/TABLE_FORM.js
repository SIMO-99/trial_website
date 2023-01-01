import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseAxios, delay } from "../../utility";
import * as Hooks from "../../hooks"

const TABLE_FORM = () => {

    const { data, loading } = Hooks.useFetch("/tables/");
    const day = new Date();
    const [month, setMonth] = useState(day.getMonth());
    const [year, setYear] = useState(day.getFullYear());
    const Navigate = useNavigate();

    const save = async (e) => {

        e.preventDefault();
        data.map(async (table) => { await saveRow(table); await delay(300) });
        alert("saved")

    }

    const executeSubmit2 = async (e) => {
        e.preventDefault();
        //save(e)


        if (window.confirm("these data will be added into the DB, are you sure?")) {
            data.map(async (table) => {

                if (table.resources > 0 && table.points > 0 && table.trophies > 0)
                    await UseAxios("/submits/", "POST", {
                        resources: table.resources, points: table.points, trophies: table.trophies,
                        player_id: table.player, month: month, year: year
                    });

                await delay(800)

            });

            await delay(4000)
            Navigate("/months/" + month + "?y=" + year);
        }


    }

    const executeSubmit = async (e) => {
        e.preventDefault();
        save(e)

        if (window.confirm("these data will be added into the DB, are you sure?")) {

            await UseAxios("/submits/confirmTables", "POST", { month: month, year: year });
            await delay(2000)
            Navigate("/months/" + month + "?y=" + year);
        }


    }

    const saveRow = async (table) => await UseAxios("/tables/" + table.player, "PUT", { resources: table.resources, points: table.points, trophies: table.trophies })

    if (!loading) {
        return (
            <>
                <br /><br />


                <div className="d-flex flex-column mx-auto w-25 justify-content-center">
                    <table id="table" className="table table-striped table-dark">
                        <thead className="text-primary"><tr><th>Year</th><th>Month</th></tr></thead>
                        <tbody><tr>
                            <td><input onChange={(e) => setYear(e.target.value)} type="text" className="form-control bg-secondary border-dark outline text-white" defaultValue={month == 0 ? year - 1 : year} /> </td>
                            <td> <input onChange={(e) => setMonth(e.target.value)} type="text" className="form-control bg-secondary border-dark outline text-white" defaultValue={month == 0 ? 12 : month} /></td>
                        </tr></tbody>
                    </table>
                </div>
                <div className="d-flex flex-column mx-auto w-75 justify-content-center">


                    <table id="table" className="table table-striped table-dark">

                        <thead className="text-danger">
                            <tr>
                                <th>Player</th>
                                <th>Resources</th>
                                <th>Points</th>
                                <th>Trophies</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((table, index) => (

                                <tr key={index}>

                                    <td className={table.color === '#000000' ? "outline2" : "outline"} style={{ color: table.color }}>{table.name}</td>
                                    <td><input onChange={(e) => table.resources = e.target.value}
                                        onBlur={() => saveRow(table)}
                                        type="text" className="form-control bg-secondary border-dark outline text-white" defaultValue={table.resources} />
                                    </td>

                                    <td><input onChange={(e) => table.points = e.target.value}
                                        onBlur={() => saveRow(table)}
                                        type="text" className="form-control bg-secondary border-dark outline text-white" defaultValue={table.points} />
                                    </td>

                                    <td><input onChange={(e) => table.trophies = e.target.value}
                                        onBlur={() => saveRow(table)}
                                        type="text" className="form-control bg-secondary border-dark outline text-white" defaultValue={table.trophies} />
                                    </td>

                                </tr>

                            ))}
                        </tbody>
                    </table>
                    <button onClick={save} className=" bg outline btn btn-secondary text-success border border-2 border-dark">Save</button>
                    <button onClick={executeSubmit} className=" bg outline btn btn-secondary text-success border border-2 border-dark">Add Into DB</button>

                    <br />
                </div>
            </>
        )
    }
}
export default TABLE_FORM