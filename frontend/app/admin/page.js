'use client';

import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import PageLoader from '@/components/ui/PageLoader';
import AppShell from '@/components/layout/AppShell';
import AuthGuard from '@/components/auth/AuthGuard';
import {
  useAdminStatsQuery,
  useAdminUsersQuery,
  useAdminPostsQuery,
  useAdminCommentsQuery,
} from '@/hooks/queries/useAdminQueries';
import {
  useDeleteAdminUserMutation,
  useDeleteAdminPostMutation,
  useDeleteAdminCommentMutation,
} from '@/hooks/mutations/useAdminMutations';

export default function AdminPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStatsQuery();
  const { data: users = [], isLoading: usersLoading } = useAdminUsersQuery();
  const { data: posts = [], isLoading: postsLoading } = useAdminPostsQuery();
  const { data: comments = [], isLoading: commentsLoading } = useAdminCommentsQuery();

  const deleteUser = useDeleteAdminUserMutation();
  const deletePost = useDeleteAdminPostMutation();
  const deleteComment = useDeleteAdminCommentMutation();

  const actionBtn = (onClick, pending) => (
    <Button icon="pi pi-trash" rounded text severity="danger" loading={pending} onClick={onClick} />
  );

  const isLoading = statsLoading || usersLoading || postsLoading || commentsLoading;

  return (
    <AuthGuard adminOnly>
      <AppShell hideSidebars>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>

          {isLoading ? (
            <PageLoader label="Loading dashboard..." />
          ) : (
            <>
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Users', value: stats.users },
                    { label: 'Admins', value: stats.admins },
                    { label: 'Posts', value: stats.posts },
                    { label: 'Comments', value: stats.comments },
                  ].map((item) => (
                    <Card key={item.label} className="text-center">
                      <p className="text-2xl font-bold text-[#1877f2]">{item.value}</p>
                      <p className="text-sm text-[#65676b]">{item.label}</p>
                    </Card>
                  ))}
                </div>
              )}

              <div className="fb-card p-4">
                <TabView>
                  <TabPanel header="Users">
                    <DataTable value={users} paginator rows={5} size="small">
                      <Column field="name" header="Name" />
                      <Column field="email" header="Email" />
                      <Column field="role" header="Role" />
                      <Column field="privacy.postVisibility" header="Post Privacy" />
                      <Column
                        header="Actions"
                        body={(row) =>
                          actionBtn(() => deleteUser.mutate(row.id), deleteUser.isPending)
                        }
                      />
                    </DataTable>
                  </TabPanel>
                  <TabPanel header="Posts">
                    <DataTable value={posts} paginator rows={5} size="small">
                      <Column field="title" header="Title" />
                      <Column field="author.name" header="Author" />
                      <Column field="author.privacy.postVisibility" header="Author Privacy" />
                      <Column
                        header="Actions"
                        body={(row) =>
                          actionBtn(() => deletePost.mutate(row.id), deletePost.isPending)
                        }
                      />
                    </DataTable>
                  </TabPanel>
                  <TabPanel header="Comments">
                    <DataTable value={comments} paginator rows={5} size="small">
                      <Column field="content" header="Content" />
                      <Column field="user.name" header="User" />
                      <Column
                        header="Actions"
                        body={(row) =>
                          actionBtn(() => deleteComment.mutate(row.id), deleteComment.isPending)
                        }
                      />
                    </DataTable>
                  </TabPanel>
                </TabView>
              </div>
            </>
          )}
        </div>
      </AppShell>
    </AuthGuard>
  );
}
