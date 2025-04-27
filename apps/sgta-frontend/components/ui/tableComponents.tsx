"use client";
import * as React from "react";

interface TableHeaderProps {
  children: React.ReactNode;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

interface UserInfo {
  name: string;
  avatar: string;
}

interface TableRowProps {
  user: UserInfo;
  code: string;
  email: string;
  dedication: string;
  assigned: string;
  specialties: string[];
  status: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({ children }) => (
  <th className="self-stretch px-4 w-full font-medium tracking-normal border-b border-solid bg-[color:var(--background)] border-b-[color:var(--border)] min-h-12 text-[color:var(--muted-foreground)] text-left">
    {children}
  </th>
);

const TableCell: React.FC<TableCellProps> = ({ children, className = "" }) => (
  <td
    className={`self-stretch px-4 w-full border-t border-b border-solid bg-[color:var(--background)] border-b-[color:var(--border)] border-t-[color:var(--border)] min-h-20 ${className}`}
  >
    {children}
  </td>
);

const TableRow: React.FC<TableRowProps> = ({
  user,
  code,
  email,
  dedication,
  assigned,
  specialties,
  status,
}) => (
  <tr>
    <TableCell>
      <div className="flex gap-2 items-center">
        <img
          src={user.avatar}
          alt={user.name}
          className="object-contain shrink-0 self-stretch my-auto w-10 aspect-square"
        />
        <span className="self-stretch my-auto">{user.name}</span>
      </div>
    </TableCell>
    <TableCell>{code}</TableCell>
    <TableCell>{email}</TableCell>
    <TableCell>{dedication}</TableCell>
    <TableCell>{assigned}</TableCell>
    <TableCell>
      <div className="flex flex-wrap gap-1.5 content-center items-center">
        {specialties.map((specialty, index) => (
          <span
            key={index}
            className="grow shrink self-stretch px-3 py-2.5 my-auto bg-blue-100 rounded-full border border-solid text-xs font-semibold text-blue-800"
          >
            {specialty}
          </span>
        ))}
      </div>
    </TableCell>
    <TableCell>{status}</TableCell>
    <TableCell>
      <div className="flex gap-1 justify-center items-center">
        <button className="flex gap-2 justify-center items-center self-stretch p-3 my-auto w-10 rounded-md min-h-10">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/4570baa0540a9cb572184249f187d96aef3080a3?placeholderIfAbsent=true&apiKey=226d0b58387b443480f4c3ceb094be8c"
            alt="Edit"
            className="object-contain self-stretch my-auto w-4 aspect-square"
          />
        </button>
        <button className="flex gap-2 justify-center items-center self-stretch p-3 my-auto w-10 rounded-md min-h-10">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/eff41f0f951ec8adb905657cb1cad0056395f31e?placeholderIfAbsent=true&apiKey=226d0b58387b443480f4c3ceb094be8c"
            alt="Delete"
            className="object-contain self-stretch my-auto w-4 aspect-square"
          />
        </button>
      </div>
    </TableCell>
  </tr>
);

export const TableComponents = {
  TableHeader,
  TableCell,
  TableRow,
};
