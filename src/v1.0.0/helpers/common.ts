const response = {
  statuses: {
    success: 'success',
    error: 'error',
  },
  create(
    res: any,
    status: string,
    data: any,
    message: string = '',
    code: number = null,
    technicalDetails: any = {}
  ) {
    const response = res.json({ status, data, message, technicalDetails });
    if (code) {
      response.status(code);
    }
    return response;
  },
};

export { response };
