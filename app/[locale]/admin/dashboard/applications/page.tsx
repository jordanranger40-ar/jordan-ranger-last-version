import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import DeleteApplicationButton from "@/components/careers/deleteApplicationButton";
import ShowApplicationComponent from "@/components/careers/showApplicationComponent";
import { deleteApplication } from "./(fetch)/deleteApplication";
import { getAllApplications } from "@/app/models/db/lib/services/careers";

export default async function applicationsTable() {
  const applications = await getAllApplications();

  return (
    <main className="flex flex-col justify-center items-center xl:ml-5 m-2">
      {/* Header */}
      <div className="flex flex-col justify-start items-start mb-6 border-b border-gray-300 w-full">
        <h1 className="text-lg md:text-2xl font-bold">Applications</h1>
        <h2 className="text-sm md:text-lg text-gray-600">
          A list of your Applications.
        </h2>
      </div>

      {applications.length === 0 ? (
        <div className="w-full text-center py-10 text-gray-500 text-lg min-w-[75vw]">
          No Applications found
        </div>
      ) : (
        <div className="w-full overflow-x-auto border border-gray-300 rounded-2xl p-2">
          <div className="min-w-[70vw]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>CV</TableHead>
                  <TableHead>Applied At</TableHead>
                  <TableHead className="text-center"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {applications.map((application, i) => (
                  <TableRow key={i}>
                    {/* Name */}
                    <TableCell className="text-xs sm:text-base">
                      {application.first_name} {application.last_name}
                    </TableCell>

                    {/* Email */}
                    <TableCell className="text-xs sm:text-base">
                      {application.email}
                    </TableCell>

                    {/* CV */}
                    <TableCell className="text-xs sm:text-base">
                      <a
                        href={application.cv}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {application.first_name}’s CV
                      </a>
                    </TableCell>

                    {/* Applied At */}
                    <TableCell className="text-xs sm:text-base">
                      {application.created_at?.toLocaleDateString()}
                    </TableCell>

                    {/* Actions (Show + Delete) */}
                    <TableCell className="text-xs sm:text-base">
                      <div className="flex items-center justify-center gap-[5px]">
                        <ShowApplicationComponent
                          application={{
                            ...application,
                            created_at: application.created_at
                              ? new Date(application.created_at)
                              : undefined,
                          }}
                        />
                        <DeleteApplicationButton
                          applicationId={application.id ?? ""}
                          deleteAction={deleteApplication}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </main>
  );
}
