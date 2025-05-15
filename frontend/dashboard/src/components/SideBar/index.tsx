'use client'
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { useSession } from "@/context/sessionContext";

import { BiHome, BiLogOut } from "react-icons/bi";

import './styles.scss';
import { TbReport } from "react-icons/tb";
import { PiFilmReel } from "react-icons/pi";
import { MdMovie } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";
import { FaUserGear } from "react-icons/fa6";

export default function SideBar() {
    const { sessionUser } = useSession();
    
    return (
        <div className="sidebar-container">
            <nav>
                {sessionUser?.role === "admin" ? (
                    <ul>
                        <li>
                            <Link href="/dashboard">
                                <BiHome size={20} />Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/cinemas">
                                <MdMovie size={20} />Cinemas
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/reports">
                                <TbReport size={20} />Relatórios
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/films">
                                <PiFilmReel size={20} />Filmes
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/employees">
                                <FaUserGear size={20} />Funcionários
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/clients">
                                <HiUserGroup size={20} />Clientes
                            </Link>
                        </li>
                    </ul>
                ) : (
                    <ul>
                        <li>
                            <Link href={`/dashboard/cinemas/${sessionUser?.cinema_id}`}>
                                <BiHome size={20} />Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link href={`/dashboard/cinemas/${sessionUser?.cinema_id}/sessions`}>
                                <MdMovie size={20} />Sessões
                            </Link>
                        </li>
                        <li>
                            <Link href={`/dashboard/cinemas/${sessionUser?.cinema_id}/rooms`}>
                                <PiFilmReel size={20} />Salas
                            </Link>
                        </li>
                        <li>
                            <Link href={`/dashboard/cinemas/${sessionUser?.cinema_id}/reports`}>
                                <TbReport size={20} />Relatórios
                            </Link>
                        </li>
                        <li>
                            <Link href={`/dashboard/cinemas/${sessionUser?.cinema_id}/employees`}>
                                <FaUserGear size={20} />Funcionários
                            </Link>
                        </li>
                    </ul>
                )}
            </nav>

            <button onClick={logout} >
                <BiLogOut size={24} />
            </button>
        </div>
    )
}