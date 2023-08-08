import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

const Loading = () => {
  return (
    <>
      {Array.from({ length: 12 }, (_, i) => i + 1).map((id) => (
        <TableRow key={id}>
          <TableCell className="font-medium space-x-2 flex align-middle items-center text-white">
            <Skeleton className="h-14 bg-slate-500 w-14"></Skeleton>
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-4 bg-slate-500 w-40"></Skeleton>
              <div className="font-light"></div>
              <Skeleton className="h-4 bg-slate-500 w-20"></Skeleton>
            </div>
          </TableCell>
          <TableCell className="text-center">
            <Skeleton className="h-4 bg-slate-500"></Skeleton>
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-3 bg-slate-500"></Skeleton>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default Loading;
